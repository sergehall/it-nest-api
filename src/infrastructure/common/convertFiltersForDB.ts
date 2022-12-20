import { Injectable } from '@nestjs/common';
import { ConvertFilterType, QueryArrType } from '../../types/types';

@Injectable()
export class ConvertFiltersForDB {
  async convert([...rawFilters]: QueryArrType) {
    const pathFilter = {
      searchNameTerm: 'name',
      searchLoginTerm: 'login',
      searchEmailTerm: 'email',
    };
    return this._forMongo([...rawFilters], pathFilter);
  }

  async _forMongo([...rawFilters], pattern: ConvertFilterType) {
    const convertedFilters = [];
    for (let i = 0, l = Object.keys(rawFilters).length; i < l; i++) {
      for (const key in rawFilters[i]) {
        if (pattern.hasOwnProperty(key) && rawFilters[i][key].length !== 0) {
          const convertedFilter = {};
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          convertedFilter[pattern[key]] = {
            $regex: rawFilters[i][key].toLowerCase(),
            $options: 'i',
          };
          convertedFilters.push(convertedFilter);
        }
      }
    }
    if (convertedFilters.length === 0) {
      convertedFilters.push({});
    }
    return convertedFilters;
  }
}
