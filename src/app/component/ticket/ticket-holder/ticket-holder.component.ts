/**
 * TicketHolderComponent
 */
import { Component, OnInit } from '@angular/core';
import { IReservation, ReservationService } from '../../../service/reservation/reservation.service';

@Component({
    selector: 'app-ticket-holder',
    templateUrl: './ticket-holder.component.html',
    styleUrls: ['./ticket-holder.component.scss']
})
/**
 * チケットホルダー
 * @class TicketHolderComponent
 * @implements OnInit
 */
export class TicketHolderComponent implements OnInit {
    public config: SwiperOptions;
    public isLoading: boolean;
    public purchaseNumberOrders: IReservation[];

    constructor(
        private reservation: ReservationService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     * @returns {Promise<void>}
     */
    public async ngOnInit(): Promise<void> {
        this.isLoading = true;
        this.purchaseNumberOrders = [];
        this.config = {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoHeight: true
        };
        try {
            await this.reservation.getReservation();
            this.purchaseNumberOrders = this.reservation.getReservationByPurchaseNumberOrder();
        } catch (err) {
            console.log(err);
        }
        this.isLoading = false;
    }

}
