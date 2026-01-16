
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service';
import { LoggerService,MultilingualTranslationsService,EventService} from '@sunbird-cb/utils-v2';
import { TranslateService } from '@ngx-translate/core';
import { RatingService } from '@sunbird-cb/collection/src/public-api';
import { CourseCompletionDialogComponent } from './course-completion-dialog.component';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';


describe('CourseCompletionDialogComponent', () => {
    let component: CourseCompletionDialogComponent;

    const ratingSvc :Partial<RatingService> ={};
	const tocSvc :Partial<AppTocService> ={};
	const loggerSvc :Partial<LoggerService> ={};
	const translate :Partial<TranslateService> ={};
	const dialogRef :Partial<MatDialogRef<CourseCompletionDialogComponent>> ={};
	const langtranslations :Partial<MultilingualTranslationsService> ={};
	const events :Partial<EventService> ={};
    const data: Partial<Record<string, any>> | undefined = {};

    beforeAll(() => {
        component = new CourseCompletionDialogComponent(
            ratingSvc as RatingService,
			tocSvc as AppTocService,
			loggerSvc as LoggerService,
			translate as TranslateService,
			dialogRef as MatDialogRef<CourseCompletionDialogComponent>,
			langtranslations as MultilingualTranslationsService,
			events as EventService,
			data 
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
});