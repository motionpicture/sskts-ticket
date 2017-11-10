/**
 * ScheduleService
 */
import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import * as sasaki from '@motionpicture/sskts-api-javascript-client';
import * as moment from 'moment';
// tslint:disable:no-import-side-effect
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

export type IMovieTheater = sasaki.factory.organization.movieTheater.IOrganizationWithoutGMOInfo;
export type IIndividualScreeningEvent = sasaki.factory.event.individualScreeningEvent.IEventWithOffer;
export interface IFilmOrder {
    id: string;
    films: IIndividualScreeningEvent[];
}
export interface IScheduleData {
    schedule: ISchedule[];
    expired: number;
}
export interface ISchedule {
    theater: IMovieTheater;
    schedule: {
        date: string;
        individualScreeningEvents: IIndividualScreeningEvent[];
    }[];
}
export interface IDate {
    value: string;
    displayText: string;
    serviceDay: string;
}

@Injectable()
export class ScheduleService {
    public data: IScheduleData;

    constructor(
        private jsonp: Jsonp,
        private storage: StorageService
    ) { }

    /**
     * スケジュール取得
     * @method getSchedule
     * @returns {Promise<IScheduleData>}
     */
    public async getSchedule(): Promise<IScheduleData> {
        const schedule: IScheduleData = (this.data === undefined)
            ? this.storage.load('schedule')
            : this.data;
        if (schedule === undefined || schedule === null || schedule.expired < moment().unix()) {
            try {
                this.data = await this.fitchSchedule({
                    beginDate: moment().format('YYYYMMDD'),
                    endDate: moment().add(1, 'month').format('YYYYMMDD')
                });
                this.storage.save('schedule', this.data);
            } catch (err) {
                this.storage.remove('schedule');
                throw err;
            }
        } else {
            this.data = schedule;
        }

        return this.data;
    }

    /**
     * スケジュールをAPI経由で取得
     * @method fitchISchedule
     * @returns {Promise<IScheduleData>}
     */
    public async fitchSchedule(
        args: { beginDate: string; endDate: string; }
    ): Promise<IScheduleData> {
        const url = `${environment.ticketingSite}/purchase/performances/getSchedule`;
        const options = {
            search: {
                callback: 'JSONP_CALLBACK',
                beginDate: args.beginDate,
                endDate: args.endDate
            }
        };
        const response = await this.jsonp.get(url, options).retry(3).toPromise();
        if (response.json().error !== null) {
            throw new Error(response.json().error);
        }
        const expired = 10;

        return {
            schedule: response.json().result,
            expired: moment().add(expired, 'minutes').unix()
        };
    }

    /**
     * 劇場取得
     * @method getTheater
     * @returns {<IMovieTheater[]}
     */
    public getTheater(): IMovieTheater[] {
        if (this.data === undefined) {
            throw new Error('schedule is undefined');
        }

        return this.data.schedule.map((schedule) => {
            return schedule.theater;
        });
    }

    /**
     * 日付取得
     * @method getDate
     * @returns {IDate[]}
     */
    public getDate(theaterCode: string): IDate[] {
        if (this.data === undefined) {
            throw new Error('schedule is undefined');
        }

        const theaterSchedule = this.data.schedule.find((schedule) => {
            return (schedule.theater.location.branchCode === theaterCode);
        });

        const dateList = theaterSchedule.schedule.filter((schedule) => {
            const screeningEvents = schedule.individualScreeningEvents.filter((screeningEvent) => {
                return (this.isSalse(screeningEvent));
            });

            return (screeningEvents.length > 0);
        });

        let count = 0;

        return dateList.map((schedule) => {
            const formatDate = moment(schedule.date).format('YYYY年MM月DD日');
            const result = {
                value: schedule.date,
                displayText: (count === 0) ? `本日 (${formatDate})`
                    : (count === 1) ? `明日 (${formatDate})`
                        : (count === 2) ? `明後日 (${formatDate})` : formatDate,
                serviceDay: schedule.individualScreeningEvents[0].coaInfo.nameServiceDay
            };
            count += 1;

            return result;
        });
    }

    /**
     * 作品別上映スケジュール取得
     * @function getScreeningEvents
     * @returns {Promise<IFilmOrder[]>}
     */
    public async getScreeningEvents(args: { theater: string, date: string }): Promise<IFilmOrder[]> {
        if (this.data === undefined) {
            throw new Error('schedule is undefined');
        }
        const results: IFilmOrder[] = [];
        const theaterSchedule = this.data.schedule.find((schedule) => {
            return (schedule.theater.location.branchCode === args.theater);
        });
        const dateSchedule = theaterSchedule.schedule.find((schedule) => {
            return (schedule.date === args.date);
        });

        const screeningEvents = dateSchedule.individualScreeningEvents.filter((screeningEvent) => {
            return (this.isSalse(screeningEvent));
        });

        screeningEvents.forEach((screeningEvent) => {
            // 販売可能時間判定
            if (!this.isSalseTime(screeningEvent)) {
                return;
            }
            const film = results.find((event) => {
                return (event.id === screeningEvent.workPerformed.identifier);
            });
            if (film === undefined) {
                results.push({
                    id: screeningEvent.workPerformed.identifier,
                    films: [screeningEvent]
                });
            } else {
                film.films.push(screeningEvent);
            }
        });

        return results;
    }

    /**
     * 販売可能時間判定
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    private isSalseTime(screeningEvent: IIndividualScreeningEvent): boolean {
        const END_TIME = 30; // 30分前

        return (moment().unix() < moment(screeningEvent.startDate).subtract(END_TIME, 'minutes').unix());
    }

    /**
     * 販売可能判定
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    private isSalse(screeningEvent: IIndividualScreeningEvent): boolean {
        const PRE_SALE = '1'; // 先行販売

        return (screeningEvent.coaInfo.rsvStartDate <= moment().format('YYYYMMDD')
            || screeningEvent.coaInfo.flgEarlyBooking === PRE_SALE);
    }

}
