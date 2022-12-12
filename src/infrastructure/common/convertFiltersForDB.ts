import { Injectable } from '@nestjs/common';
import { ConvertFilterType, DtoQueryType } from '../../types/types';

@Injectable()
export class ConvertFiltersForDB {
  async convert([...rawFilters]: DtoQueryType) {
    const pathFilter = {
      searchNameTerm: 'name',
      searchLoginTerm: 'login',
      searchEmailTerm: 'email',
    };
    return this._convert([...rawFilters], pathFilter);
  }
  async convertForUser([...rawFilters]) {
    const pathFilter = {
      searchLoginTerm: 'accountData.login',
      searchEmailTerm: 'accountData.email',
    };
    return this._convert([...rawFilters], pathFilter);
  }

  async _convert([...rawFilters], pattern: ConvertFilterType) {
    const convertedFilters = [];
    for (let i = 0, l = Object.keys(rawFilters).length; i < l; i++) {
      for (const key in rawFilters[i]) {
        if (pattern.hasOwnProperty(key) && rawFilters[i][key].length !== 0) {
          const convertedFilter = {};
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          convertedFilter[pattern[key]] = { $regex: rawFilters[i][key] };
          convertedFilters.push(convertedFilter);
        } else {
          convertedFilters.push({});
        }
      }
    }
    return convertedFilters;
  }
}
