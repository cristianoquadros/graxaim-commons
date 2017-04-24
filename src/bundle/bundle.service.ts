import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class BundleService {

    constructor() { }

    getBundle(messages: any, group: string, item: string, ...args) {
        let txt: string = messages[group][this.getChaveMensagem(item)] || this.getMensagem(item);
        if (!_.isEmpty(args)) {
            // /{(.*?)}/   txt like {?}
            // /{([^}]*)}/ txt out of {}
            txt = txt.replace(/{(.*?)}/g, mark => args[mark.match(/{([^}]*)}/)[1]]);
        }
        return txt;
    }

    private getChaveMensagem(item: string) {
        if (item.search(/^\[:\W*/g) === 0) {
            return item.match(/[^[\]]+(?=])/g)[0].replace(":", "");
        } else {
            return item;
        }
    }

  private getMensagem(item: string) {
    if (item.search(/^\[:\W*/g) === 0) {
      return item.split('-')[1];
    } else {
      return item;
    }
  }
}
