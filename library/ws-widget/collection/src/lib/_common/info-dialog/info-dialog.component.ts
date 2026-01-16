import { Component, OnInit, Inject, ViewChild, ComponentFactoryResolver, ComponentRef, ViewContainerRef, OnDestroy } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-widget-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent implements OnInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef | undefined

  componentRef: ComponentRef<any> | undefined

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.component) {
      const factory = this.resolver.resolveComponentFactory(this.data.component)
      this.componentRef = this.vcRef && this.vcRef.createComponent(factory)
    }
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy()
    }
  }

}
