import { Component, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { ServerModel } from 'src/app/models/server-model'
import { ApiService } from 'src/app/services/api/api.service'
import { ConfigService } from 'src/app/services/config.service'

@Component({
  selector: 'os-welcome',
  templateUrl: './os-welcome.page.html',
  styleUrls: ['./os-welcome.page.scss'],
})
export class OSWelcomePage {
  @Input() version: string

  autoCheckUpdates = true

  constructor (
    private readonly modalCtrl: ModalController,
    private readonly apiService: ApiService,
    private readonly serverModel: ServerModel,
    private readonly config: ConfigService,
  ) { }

  // autoCheckUpdates default must be false when upgrading to
  async dismiss () {
    this.apiService
        .patchServerConfig('autoCheckUpdates', this.autoCheckUpdates)
        .then(() => this.serverModel.update({ autoCheckUpdates: this.autoCheckUpdates }))
        .then(() => this.apiService.acknowledgeOSWelcome(this.config.version))
        .catch(console.error)

    return this.modalCtrl.dismiss({ autoCheckUpdates: this.autoCheckUpdates })
  }
}
