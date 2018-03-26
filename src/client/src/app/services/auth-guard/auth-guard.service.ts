/**
 * AuthGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SasakiService } from '../sasaki/sasaki.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private sasaki: SasakiService,
        private user: UserService
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            await this.sasaki.authorize();

            if (!this.user.isMember()) {
                const deviceId = localStorage.getItem('deviceId');
                if (deviceId === null) {
                    throw new Error('deviceId is null');
                }
            }

            return true;
        } catch (err) {
            console.log('canActivate', err);
            this.router.navigate(['/auth/select']);

            return false;
        }
    }
}
