import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service'
import { ActivatedRoute, Params } from '@angular/router';

declare const ace:any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  sessionId: string;
  languages: string[] = ['java','Python'];
  themes:string[] = ['xcode','monokai'];
  theme:string = 'xcode';
  language: string = 'java';
  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute) { }

  defaultContent = {
    'java': 'public class Example{}',
    'Python': 'def example():',

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id']
    });
    this.initEditor();
  }

  initEditor(){
    this.editor = ace.edit('editor');
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/xcode');
    this.editor.getSession().setMode("ace/mode/java");
    this.editor.setValue(this.defaultContent['java']);
    this.editor.setShowPrintMargin(false);

    document.getElementsByTagName('textarea')[0].focus();

    this.editor.lastAppliedChanged = null;
    this.collaboration.init(this.editor,this.sessionId);

    //register change callback
    this.editor.on('change',e=>{
      console.log('editor changed: ' + JSON.stringify(e));
      if ( this.editor.lastAppliedChanged != e){
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }

  setLanguage(language: string): void{
    this.language = language;
    this.resetEditor();
  }

  setTheme(theme:string):void{
    this.theme = theme;
    this.resetEditor();
  }

  resetEditor():void{
    console.log('Resetting editor...');
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.getSession().setMode(`ace/mode/${this.language.toLocaleLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(){
    const userCodes = this.editor.getValue();
    console.log(userCodes)
  }
}
