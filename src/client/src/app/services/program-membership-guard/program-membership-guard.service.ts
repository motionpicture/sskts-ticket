import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SasakiService } from '../sasaki/sasaki.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProgramMembershipGuardService implements CanActivate {

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
        if (this.user.data.programMembershipOwnershipInfos === undefined) {
            this.user.data.programMembershipOwnershipInfos = [];
        }
        if (this.user.data.programMembershipOwnershipInfos.length > 0) {
            return true;
        }
        await this.sasaki.getServices();
        const programMembershipOwnershipInfos = await this.sasaki.person.searchOwnershipInfos({
            ownedBy: 'me',
            goodType: 'ProgramMembership'
        });
        if (programMembershipOwnershipInfos.length === 0) {
            this.router.navigate(['/auth/register/payment']);

            return false;
        }

        this.user.data.programMembershipOwnershipInfos = programMembershipOwnershipInfos;

        return true;
    }

}
