import { Component } from '@angular/core'
import { ConfigService } from 'src/app/services/config.service'
import { ConnectionService } from 'src/app/services/connection.service'
import { PatchDbModel } from 'src/app/services/patch-db/patch-db.service'
import { PackageDataEntry } from 'src/app/services/patch-db/data-model'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-list',
  templateUrl: './app-list.page.html',
  styleUrls: ['./app-list.page.scss'],
})
export class AppListPage {
  connected: boolean
  subs: Subscription[] = []

  constructor (
    private readonly config: ConfigService,
    public readonly connectionService: ConnectionService,
    public readonly patch: PatchDbModel,
  ) { }

  ngOnInit () {
    this.subs = [
      this.patch.connected$().subscribe(c => this.connected = c),
    ]
  }

  ngOnDestroy () {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  launchUi (pkg: PackageDataEntry, event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    window.open(this.config.launchableURL(pkg.installed), '_blank')
  }

  asIsOrder () {
    return 0
  }
}