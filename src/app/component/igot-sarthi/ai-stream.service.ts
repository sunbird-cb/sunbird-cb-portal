// services/ai-stream.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiStreamService {
   private answerBuffer = '';
 // private jsonChunkBuffer = '';
 // private objectBuffer = '';
//  private openBraces = 0;
 // private insideObject = false;

// private buffer = '';
  // private parsedObjects: any[] = [];
  // private openBracesCount = 0;
  // private objectBuffer = '';
  // private insideObject = false;

  public answer$ = new Subject<string>();
  public retrievedChunks$ = new Subject<any>();
  public final$ = new Subject<void>();
  private buffer: string = '';
  public chunks: any[] = [];

  constructor() {}
  private hasEmittedAnswer = false;

  public resetEmittedAnswer() {
     this.hasEmittedAnswer = false
     this.answerBuffer = '';
     // this.jsonChunkBuffer = '';
     // this.objectBuffer = '';
     // this.openBraces = 0;
     // this.insideObject = false;
  }
  public handleMessage(raw: any): void {
    // if (!raw || !raw.data) return;

    const { type, data } = raw;

    
    if (typeof raw === 'object' && raw.answer && !this.hasEmittedAnswer) {
      this.answerBuffer += this.unescape(raw.answer);
      this.answer$.next(this.answerBuffer);
      this.hasEmittedAnswer = true;
     // return;
    }  
    
    if (type === 'stream' && data && !this.hasEmittedAnswer) {
     // this.buffer += data;
    
      this.handleStream(data);
    
    
      // continue handling retrieved_chunks etc.
    }

    if (type === 'stream' && data) {
      
      // Append data to buffer
      this.buffer += data;
      // console.log('this.buffer',this.buffer)
      // Try to parse when we see the end of a valid JSON
      if (this.buffer.includes('retrieved_chunks') || this.buffer.includes('Identifier') || this.buffer.trim().endsWith(']}')) {
        try {

        //   const fixedJson = this.extractValidJSON(this.buffer)['substring'];

        //   console.log('fixedJson', fixedJson)
        //   if(this.isValidJSON(fixedJson)) {
        //     console.log('fixedJson',JSON.parse(fixedJson))
        //   }
        //   const retriveObject = this.buffer.substring(fixedJson.startIndex, fixedJson.endIndex)
        // //  console.log('retriveObject',retriveObject)
        //   if(retriveObject) {
        //     const parsed = JSON.parse(retriveObject);
        //     console.log('parsed',parsed)
        //     // if (Object.keys(parsed).length) {
        //       this.chunks.push(parsed);
        //       console.log('✅ Chunks parsed and pushed to array:', this.chunks);
              
        //   }

        const { parsedObjects, remaining } = this.extractValidJSON(this.buffer);
        //console.log('parsedObjects',parsedObjects)
        if (parsedObjects.length) {
          
          this.chunks.push(...parsedObjects);
          console.log('✅ Parsed JSON objects:', parsedObjects);
        }
      
        this.buffer = remaining;
         

            // Reset buffer after success
           // this.buffer = '';
          // } 
        } catch (jsonErr) {
          console.warn('Waiting for full JSON… not ready yet.');
          // Do nothing — keep buffering
          this.buffer += data
        }
      }
    }

    if(type === 'final') {
      this.handleFinal();
    }

    // if (type === 'stream') {
    //   this.handleStream(data);
    // } else if (type === 'final') {
    //   this.handleFinal();
    // }
  }

  // private handleStream(data: string | any) {
  //   if (!data) return;
   
  //   if (typeof data === 'string') {
  //     let chunkIndex = data.indexOf('"retrieved_chunks":');
  //     if (chunkIndex !== -1) {
  //       // 👇 Only parse answer if not already emitted
  //       if (!this.hasEmittedAnswer) {
  //         const beforeChunks = data.substring(0, chunkIndex);
  //         const answerMatch = beforeChunks.match(/"answer"\s*:\s*"([^]*)"/);
  //         if (answerMatch && answerMatch[1]) {
  //           const cleanAnswer = this.unescape(answerMatch[1]);
  //           this.answerBuffer += cleanAnswer;
  //           this.answer$.next(this.answerBuffer);
  //           this.hasEmittedAnswer = true;
  //         } else {
  //           this.answerBuffer += this.unescape(beforeChunks);
  //           this.answer$.next(this.answerBuffer);
  //           this.hasEmittedAnswer = true;
  //         }
  //       }  
  //     } else if (!this.hasEmittedAnswer) {
  //       this.answerBuffer += this.unescape(data);
  //       this.answer$.next(this.answerBuffer);
  //     }
  //   }
  // }
  
  // private processChunk(chunk: string) {
  //   for (let i = 0; i < chunk.length; i++) {
  //     const char = chunk[i];

  //     if (char === '{') {
  //       this.openBracesCount++;
  //       this.insideObject = true;
  //     }

  //     if (this.insideObject) {
  //       this.objectBuffer += char;
  //     }

  //     if (char === '}') {
  //       this.openBracesCount--;
  //       if (this.openBracesCount === 0) {
  //         // End of a full object
  //         try {
  //           const json = JSON.parse(this.objectBuffer);
  //           this.parsedObjects.push(json);
  //           console.log('Parsed Object:', json);
  //           console.log('this.parsedObjects',this.parsedObjects)
  //         } catch (e) {
  //           console.error('JSON Parse Error:', e, this.objectBuffer);
  //         }

  //         // Reset for next object
  //         this.objectBuffer = '';
  //         this.insideObject = false;
  //       }
  //     }
  //   }
  //   this.jsonChunkBuffer = this.insideObject ? this.objectBuffer : '';
  // }
  

  // private extractRetrievedChunks(buffer: string) {
  // //  let i = 0;
  
  //   // Start with any leftover data from previous chunk
  //  let tempBuffer =  buffer;
  //   // Reset here; will be reassigned at end if needed
  //   console.log('tempBuffer', tempBuffer)
  //   // while (i < tempBuffer.length) {
  //   //   const char = tempBuffer[i];
  
  //   //   if (!this.insideObject) {
        
  //   //     const startIdx = tempBuffer.indexOf('{', i);
  //   //     console.log('startIdx',startIdx)
  //   //     if (startIdx === -1) {
  //   //       // No start of a new object found; save leftover data
  //   //       this.jsonChunkBuffer = tempBuffer.slice(i);
  //   //       return;
  //   //     }
  
  //   //     this.objectBuffer = '{';
  //   //     this.openBraces = 1;
  //   //     this.insideObject = true;
  //   //     i = startIdx + 1;
  //   //     continue;
  //   //   }
  
  //   //   this.objectBuffer += char;
  
  //   //   if (char === '{') this.openBraces++;
  //   //   else if (char === '}') this.openBraces--;
  //   //   if (this.openBraces === 0) {
  //   //     // Full object detected
  //   //     try {
  //   //       const obj = JSON.parse(this.objectBuffer);
  //   //       console.log('obj', obj)
  //   //       if (obj.Identifier) {
  //   //         this.retrievedChunks$.next(obj);
  //   //       }
  //   //     } catch (e) {
  //   //       console.warn('[CHUNK] Invalid JSON object:', this.objectBuffer);
  //   //     }
  
  //   //     // Reset for next possible object
  //   //     this.objectBuffer = '';
  //   //     this.insideObject = false;
  //   //   }
  
  //   //   i++;
  //   // }
  
  //   // If we're still inside an object, keep that for the next round
  //   // this.jsonChunkBuffer = this.insideObject ? this.objectBuffer : '';
  // }
  

  private handleFinal() {
    // this.answerBuffer = '';
    // this.jsonChunkBuffer = '';
  //  this.objectBuffer = '';
  //  this.openBraces = 0;
   // this.insideObject = false;
    this.final$.next();
  }

  private unescape(str: string): string {
    try {
      return str
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r');
    } catch {
      return str;
    }
  }

  private extractValidJSON(buffer: string): { parsedObjects: any[], remaining: string } {
    const parsedObjects: any[] = [];
    let depth = 0;
   // let inString = false;
    let startIndex = -1;
   // console.log('buffer',buffer)
    for (let i = 0; i < buffer.length; i++) {
      const char = buffer[i];
  
      // Toggle inString when encountering unescaped "
      // if (char === '"' && buffer[i - 1] !== '\\') {
      //   this.extractValidJSON(buffer)
      // }
  
      // if (!inString) {
        if (char === '{') {
          startIndex = i;
          // depth++;
        }  
        
        if (char === '}') {
          // depth--;
          // if ( startIndex !== -1) {

            const jsonStr = buffer.substring(startIndex, i + 1);
            
            this.chunks.push(jsonStr)
            try {
              const parsed = JSON.parse(jsonStr);
              this.retrievedChunks$.next(parsed);
              parsedObjects.push(parsed);
            } catch (e) {
              console.warn('Invalid JSON skipped:', jsonStr);
            }
            startIndex = -1;
          // }
        }
      // }
    }
  
    const remaining = depth > 0 && startIndex !== -1 ? buffer.slice(startIndex) : '';
  
    return { parsedObjects, remaining };
  }
  
  private handleStream(data: string | any) {
    
  
    if (typeof data === 'string') {
      // ✅ Split answer and retrieved_chunks
      if (!this.hasEmittedAnswer) {
        // Find start of retrieved_chunks
        const chunksIndex = data.indexOf('"retrieved_chunks":');
  
        if (chunksIndex !== -1) {
          // 🟢 There's both answer and chunks in this string
          let answerPart = data.substring(0, chunksIndex);
          answerPart = answerPart.replace(/^answer\\?": ?\\?"/, '');
          this.answerBuffer += this.unescape(answerPart);
          this.answer$.next(this.answerBuffer);
          this.hasEmittedAnswer = true;
  
          // Save rest for chunks
          // this.jsonChunkBuffer = data.substring(chunksIndex);
          // this.processChunk(this.jsonChunkBuffer);
        } else {
          // 🟡 Just part of the answer
          let answerPart = data.replace(/^answer\\?": ?\\?"/, '');
          this.answerBuffer += this.unescape(answerPart);
          this.answer$.next(this.answerBuffer);
        }
      } else {
        // 🔵 Already emitted answer, now process remaining chunk
        // this.jsonChunkBuffer += data;
        // this.processChunk(this.jsonChunkBuffer);
      }
    }
  }

  isValidJSON(jsonString:any) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}
}
