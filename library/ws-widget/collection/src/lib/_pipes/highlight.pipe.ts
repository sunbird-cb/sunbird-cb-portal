import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, _keyword: string, shouldHighlight: boolean): SafeHtml {    
    if (!shouldHighlight || !text) return text;
  
    // Simply wrap the entire text in highlight span if condition matches
    const highlighted = `<span class="highlight">${text}</span>`;
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}