import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SplitPaneTracker } from 'src/app/services/split-pane.service'
import { PatchDB } from 'patch-db-client'
import { DataModel } from 'src/app/services/patch-db/data-model'

@Component({
  selector: 'badge-menu-button',
  templateUrl: './badge-menu.component.html',
  styleUrls: ['./badge-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeMenuComponent {
  unreadCount$ = this.patch.watch$('server-info', 'unread-notification-count')
  sidebarOpen$ = this.splitPane.sidebarOpen$

  constructor(
    private readonly splitPane: SplitPaneTracker,
    private readonly patch: PatchDB<DataModel>,
  ) {}
}
