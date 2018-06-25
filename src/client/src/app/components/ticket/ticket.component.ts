/**
 * TicketComponent
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IReservation, ReservationService } from '../../services/reservation/reservation.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.scss']
})
/**
 * チケットホルダー
 * @class TicketComponent
 * @implements OnInit
 */
export class TicketComponent implements OnInit {
    public config: SwiperOptions;
    public isLoading: boolean;
    public reservations: IReservation[];

    constructor(
        private router: Router,
        private reservation: ReservationService,
        public user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        window.scrollTo(0, 0);
        this.isLoading = true;
        this.reservations = [];
        this.config = {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoHeight: true
        };
        this.reservation.isMember = this.user.isMember();
        try {
            this.reservations = await this.reservation.getReservationByAppreciationDayOrder();
        } catch (err) {
            this.router.navigate(['/error', { redirect: '/ticket' }]);
            console.log(err);
        }

        this.isLoading = false;
    }

}
