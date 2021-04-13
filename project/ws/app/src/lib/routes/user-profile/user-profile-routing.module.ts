import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserProfileComponent } from './components/user-profile/user-profile.component'
import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
{
    path: 'details',
    component: UserProfileComponent,
    resolve: {
        profileData: ProfileResolverService,
    },
},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ConfigResolverService, ProfileResolverService],
})
export class UserProfileRoutingModule { }
