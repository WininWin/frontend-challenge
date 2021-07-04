export interface IApiResponse {
    data: ICityInfo[];
    total: number;
    links: {
      first: string;
      next?: string;
      prev?: string;
      last: string;
    };
    filter?: string;
  };
  
  export interface ICityInfo {
    geonameid: number;
    name: string;
    country: string;
    subcountry?: string;
  };

  export interface IPreferredCitiesResponse {
    data: number[];
    total: number;
    links: {
      first: string;
      next?: string;
      prev?: string;
      last: string;
    };
  };

  export interface IPreferredCitiesPatch {
    [id: string]: boolean;
  };