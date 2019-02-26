import { NgModule } from '@angular/core';
import { MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export function metaFactory(translate: TranslateService): MetaLoader {
  return new MetaStaticLoader({
    callback: (key: string): Observable<string | Object> => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'Surveys by ME',
    defaults: {
      title: 'Surveys by ME',
      description: 'Surveys by ME is Providing professional surveys, designed for simplicity and ease of use. We provide surveys for large corperations, small businesses, students, and many more. Create your free survey today.',
      'og:site_name': 'Surveys by ME',
      'og:type': 'website',
      'og:locale': 'en-US',
      'og:locale:alternate': [
        { code: 'en', name: 'English', culture: 'en-US' },
        { code: 'es', name: 'Spanish', culture: 'es-MX' },
      ]
        .map((lang: any) => lang.culture)
        .toString(),
    },
  });
}

@NgModule({
  imports: [
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
      deps: [TranslateService],
    }),
  ],
})
export class SharedMetaModule {}
