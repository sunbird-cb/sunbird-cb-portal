import {
    Input,
    Renderer2, HostListener,
    Directive, ElementRef,
    TemplateRef, ViewContainerRef,
    ContentChild,
} from '@angular/core'

@Directive({ selector: '[wsTooltipDirective]' })
export class TooltipDirective {
    // private tooltipId!: string
    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef) { }

    @Input() parametroPlantilla!: TemplateRef<any>
    @Input() placement = 'top'
    // @Input() close
    @ContentChild('tooltipTemplate')
    private tooltipTemplateRef!: TemplateRef<Object>
    offset = 10
    @HostListener('mouseenter') onMouseEnter(): void {
        const view = this.viewContainerRef.createEmbeddedView(this.tooltipTemplateRef)
        view.rootNodes.forEach(node =>
            this.renderer.appendChild(this.elementRef.nativeElement, node))
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.viewContainerRef) {
            this.viewContainerRef.clear()
        }
    }

    setPosition() {
        const hostPos = this.elementRef.nativeElement.getBoundingClientRect()
        const tooltipPos = this.tooltipTemplateRef.elementRef.nativeElement.getBoundingClientRect()
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

        let top
        let left

        if (this.placement === 'top') {
            top = hostPos.top - tooltipPos.height - this.offset
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2
        }

        if (this.placement === 'bottom') {
            top = hostPos.bottom + this.offset
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2
        }

        if (this.placement === 'left') {
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2
            left = hostPos.left - tooltipPos.width - this.offset
        }

        if (this.placement === 'right') {
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2
            left = hostPos.right + this.offset
        }

        // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
        this.renderer.setStyle(this.tooltipTemplateRef, 'top', `${top + scrollPos}px`)
        this.renderer.setStyle(this.tooltipTemplateRef, 'left', `${left}px`)
    }
}
