import { Injectable } from '@angular/core';

import { FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import * as cryptojs from 'crypto-js';
import * as moment from 'moment';

import { EditorConfig } from '../models/dynamicEditor.interface';

import { ExamValuePipe } from '../pipes/exam-value.pipe';
import { ExtraValuePipe } from '../pipes/extra-value.pipe';

import { ConfigService } from './config.service';

/**
 * Provide global functions
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /** Initialization vector for encryption */
  private iv = '';

  /** Default datetime format */
  private datetimeFormat = 'YYYY-MM-DD';

  public localStorageLoginMode = 'OCG_LS_LoginMode';
  public localStorageLoginUser = 'OCG_LS_LoginUser';

  public attConfiguration = 'ocgConfigurationXML';
  public attAdminViewSets = 'ocgAdminViewSetRefs';
  public attPrimaryViewSets = 'ocgPrimaryViewSetRef';
  public attObjectType = 'ocgObjectType';

  /**
   * @ignore
   */
  constructor(
    private config: ConfigService,
    private examValuePipe: ExamValuePipe,
    private extraValuePipe: ExtraValuePipe
  ) {
    this.iv = cryptojs.enc.Hex.parse('OCGMobileService');
  }

  /**
   * String to hex string converter
   * @param text Text string
   */
  private stringToHexString(text: string) {
    let str = '';
    for (let i = 0; i < text.length; i++) {
      str += text.charCodeAt(i).toString(16);
    }
    return str;
  }

  /**
   * Get hex string of the key
   * @param text Key text
   */
  private getKey(text: string) {
    const hexKey = this.stringToHexString(text);
    const key = cryptojs.enc.Hex.parse(hexKey);
    return key;
  }

  /**
   * Build data service url
   * @param baseUrl Base url of the web api
   * @param controllerName Controller name of the web api
   * @param methodName Method name of the web api
   * @param serviceType Service type of the web api
   * @param paths Router paths of the web api
   */
  public buildDataServiceUrl(
    baseUrl: string,
    controllerName: string,
    methodName?: string,
    serviceType?: string,
    paths?: string[]
  ) {
    let url = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    url = serviceType ? `${url}${serviceType}/${controllerName}` : `${url}${controllerName}`;

    if (methodName) {
      url = `${url}/${methodName}`;
    }

    if (paths && paths.length > 0) {
      paths.forEach(path => {
        url = `${url}/${path}`;
      });
    }

    return url;
  }

  /**
   * Encrypt message
   * @param message Message to encrypt
   * @param key Encryption key
   */
  public Encrypt(message: string, key?: string) {
    if (!key) {
      key = 'OCGDESecurityAES';
    }
    return cryptojs.AES.encrypt(message, this.getKey(key), {
      iv: this.getKey('OCGMobileService')
    }).toString();
  }

  /**
   * Decrypt message
   * @param message Message to decrypt
   * @param key Encryption key
   */
  public Decrypt(message: string, key?: string) {
    if (!key) {
      key = 'OCGDESecurityAES';
    }
    return cryptojs.AES.decrypt(message, this.getKey(key), {
      iv: this.getKey('OCGMobileService')
    }).toString(cryptojs.enc.Utf8);
  }

  /**
   * Deep copy an object
   * @param obj object to be copied
   */
  public DeepCopy(obj: any) {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.DeepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.DeepCopy(obj[attr]);
        }
      }
      return copy;
    }

    // tslint:disable-next-line:quotemark
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * Evaluate text as script
   * @param text text to be executed as script
   */
  public EvalScript(text: string) {
    if (text.startsWith('<') && text.endsWith('>')) {
      const script = text.substring(1, text.length - 1).replace(/ /g, '');
      const scripts = script.split('()');
      switch (scripts[0].toLowerCase()) {
        case 'today':
          const now = moment();
          if (scripts.length === 1) {
            return now.format(this.config.getConfig('datetimeDisplayFormat', this.datetimeFormat));
          } else if (scripts.length === 2) {
            return now
              .add(+scripts[1], 'd')
              .format(this.config.getConfig('datetimeDisplayFormat', this.datetimeFormat));
          } else {
            throw new Error(`cannot evaluate expression: ${script}`);
          }
        default:
          throw new Error(`cannot evaluate expression: ${script}`);
      }
    } else {
      return text;
    }
  }

  /**
   * Copy source object properties to target object,
   * iterate throuth source or target properties through the useTargetProperties option
   * @param source source object copied to target object
   * @param target target object takes properties from source object
   * @param useTargetProperties set to true to use target properties, false to use source properties, default is false
   * @param onlyCopyIfDefined source property will not be copied, if it is undefined
   */
  public CopyInto(
    source: any,
    target: any,
    useTargetProperties = false,
    onlyCopyIfDefined = false
  ) {
    if (source && target) {
      const keys = useTargetProperties ? Object.keys(target) : Object.keys(source);

      keys.forEach(key => {
        if (source[key] !== null) {
          if (onlyCopyIfDefined) {
            if (source[key] !== undefined) {
              target[key] = source[key];
            }
          } else {
            target[key] = source[key];
          }
        }
      });
    }
  }

  /**
   * Convert Filter to XPath query
   * @param filterDescriptor Composite filter descriptior
   */
  public FilterToXPath(filterDescriptor: CompositeFilterDescriptor) {
    if (filterDescriptor.filters && filterDescriptor.filters[0]) {
      const descriptor = filterDescriptor.filters[0] as CompositeFilterDescriptor;

      if (descriptor) {
        const conditions: string[] = [];

        descriptor.filters.forEach((filter: FilterDescriptor) => {
          switch (filter.operator) {
            case 'eq':
              conditions.push(`${filter.field}='${filter.value}'`);
              break;
            case 'neq':
              conditions.push(`not(${filter.field}='${filter.value}')`);
              break;
            case 'startswith':
              conditions.push(`starts-with(${filter.field},'${filter.value}')`);
              break;
            case 'endswith':
              conditions.push(`ends-with(${filter.field},'${filter.value}')`);
              break;
            case 'isempty':
              conditions.push(`not(starts-with(${filter.field},'%'))`);
              break;
            case 'isnotempty':
              conditions.push(`starts-with(${filter.field},'%')`);
              break;
            case 'gt':
              conditions.push(`${filter.field}>'${filter.value}'`);
              break;
            case 'lt':
              conditions.push(`${filter.field}<'${filter.value}'`);
              break;
            default:
              break;
          }
        });

        return conditions.join(` ${descriptor.logic} `);
      }
    }

    return undefined;
  }

  public GetEditorExpressions(
    attributeName: string,
    configs: Array<EditorConfig>,
    configName: string
  ) {
    const retVal: { [key: string]: Array<string> } = {};

    configs.forEach((config: EditorConfig) => {
      if (config[configName] && config[configName].indexOf(`[#${attributeName}]`) >= 0) {
        if (Object.keys(retVal).indexOf(config.attributeName) >= 0) {
          retVal[config.attributeName].push(config[configName]);
        } else {
          retVal[config.attributeName] = [config[configName]];
        }
      }
    });

    return retVal;
  }

  public ExamValue(value: any, path: string): boolean {
    return this.examValuePipe.transform(value, path);
  }

  public ExtraValue(value: any, path: string): any {
    return this.examValuePipe.transform(value, path)
      ? this.extraValuePipe.transform(value, path)
      : undefined;
  }
}
