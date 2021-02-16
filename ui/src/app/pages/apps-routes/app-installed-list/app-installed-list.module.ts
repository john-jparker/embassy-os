import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { AppInstalledListPage } from './app-installed-list.page'
import { StatusComponentModule } from 'src/app/components/status/status.component.module'
import { SharingModule } from 'src/app/modules/sharing.module'
import { BadgeMenuComponentModule } from 'src/app/components/badge-menu-button/badge-menu.component.module'

const routes: Routes = [
  {
    path: '',
    component: AppInstalledListPage,
  },
]

@NgModule({
  imports: [
    CommonModule,
    StatusComponentModule,
    SharingModule,
    IonicModule,
    RouterModule.forChild(routes),
    BadgeMenuComponentModule,
  ],
  declarations: [
    AppInstalledListPage,
  ],
})
export class AppInstalledListPageModule { }
