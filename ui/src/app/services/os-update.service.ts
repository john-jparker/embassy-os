import { Injectable } from '@angular/core'
import { NavController } from '@ionic/angular'
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs'
import { catchError, concatMap, distinctUntilChanged, map, take, tap } from 'rxjs/operators'
import { ServerModel, ServerStatus } from '../models/server-model'
import { ApiService } from './api/api.service'
import { Emver } from './emver.service'


// call checkForUpdates in marketplace pages, can subscribe globally however
type UpdateAvailable = { versionLatest: string, releaseNotes: string}
@Injectable({ providedIn: 'root' })
export class OsUpdateService {
  // holds version latest if update available, undefined if not.
  private readonly $updateAvailable$ = new BehaviorSubject<UpdateAvailable>(undefined)

  watchForUpdateAvailable$ (): Observable<undefined | UpdateAvailable> {
    return this.$updateAvailable$.asObservable().pipe(distinctUntilChanged())
  }

  constructor (
    private readonly emver: Emver,
    private readonly serverModel: ServerModel,
    private readonly apiService: ApiService,
    private readonly navCtrl: NavController,
  ) { }

  // emits the latest version or re-checks to see if there's a new latest version
  checkWhenNotAvailable$ (): Observable<undefined | UpdateAvailable> {
    return this.$updateAvailable$.pipe(
      take(1),
      concatMap(vl => vl ? of(vl) : this.checkForUpdates$()),
    )
  }

  // can sub to this imperatively and take the return value as gospel, or watch the $updateAvailable$ subject for the same info.
  checkForUpdates$ (): Observable<undefined | UpdateAvailable> {
    return forkJoin([
      this.serverModel.watch().versionInstalled.pipe(take(1)),
      this.apiService.getVersionLatest(),
    ]).pipe(
      map(([vi, vl]) => this.updateIsAvailable(vi, vl) ? vl : undefined),
      catchError(e => {
        console.error(`OsUpdateService Error: ${e}`)
        return of(undefined)
      }),
      // cache the result for components to learn update available without having to have called this method
      tap(this.$updateAvailable$),
    )
  }

  updateIsAvailable (vi: string, vl: UpdateAvailable): boolean {
    if (!vi || !vl) return false
    if (this.emver.compare(vi, vl.versionLatest) === -1) {
      this.$updateAvailable$.next(vl)
      return true
    } else {
      this.$updateAvailable$.next(undefined)
      return false
    }
  }

  async updateEmbassyOS (versionLatest: string): Promise<void> {
    await this.apiService.updateAgent(versionLatest)
    this.serverModel.update({ status: ServerStatus.UPDATING })
    this.$updateAvailable$.next(undefined)
    await this.navCtrl.navigateRoot('/embassy')
  }
}
