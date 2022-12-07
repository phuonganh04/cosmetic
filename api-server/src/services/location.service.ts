import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { SystemFileUtils } from '../common/system-utils';
import { Location } from '../models';
import { LocationRepository } from '../repositories';

@injectable({ scope: BindingScope.TRANSIENT })
export class LocationService {
  private defaultStates: any[]
  private defaultStatesVietNam: any[]
  private defaultTownDistrictVietNam: any[]
  private defaultSubDistrictVietNam: any[]

  constructor(
    @repository(LocationRepository)
    public locationRepository: LocationRepository,
  ) { }

  /*
   * Add service methods here
   */
  async resyncDefaultCountry() {
    const where: any = { "info.countryCode": "VN" }
    const defaultLocation = await this.locationRepository.findOne({ where })
    if (!!defaultLocation) {
      return
    }

    this.defaultStatesVietNam = await SystemFileUtils.getConfigs("VN-state-list.json");
    this.defaultTownDistrictVietNam = await SystemFileUtils.getConfigs("VN-town-district-list.json");
    this.defaultSubDistrictVietNam = await SystemFileUtils.getConfigs("VN-sub-district-list.json");

    const statesVietNam = await this.reSyncDefaultStateVietNam()
    const townDistrictListVietNam = await this.reSyncDefaultTownDistrictVietNam(statesVietNam)
    await this.reSyncDefaultSubDistrictVietNam(townDistrictListVietNam)
  }

  reSyncDefaultStateVietNam = async () => {
    const newStates = this.defaultStatesVietNam.map(state => {
      return new Location({
        name: `${state.name}`,
        type: Location.TYPE.STATE,
        description: `${state.name_with_type}`,
        info: {
          code: `${state.code}`,
          countryCode: `VN`
        }
      })
    })
    return await this.locationRepository.createAll(newStates)
  }

  reSyncDefaultTownDistrictVietNam = async (stateList: Location[]) => {
    let townDistrictsInsert: Location[] = new Array();
    stateList.map(state => {
      const defaultTownDistrictByState = this.defaultTownDistrictVietNam.filter(townDistrict => townDistrict.parent_code === state.info.code)
      const newtownDistrictByState = defaultTownDistrictByState.map(townDistrict => {
        return new Location({
          name: `${townDistrict.name}`,
          type: Location.TYPE.DISTRICT,
          parentId: state.id,
          description: `${townDistrict.name_with_type}`,
          info: {
            code: `${townDistrict.code}`,
            parentCode: `${state.info.code}`,
            countryCode: `${state.info.countryCode}`
          }
        })
      })
      townDistrictsInsert.push(...newtownDistrictByState)
    })

    return await this.locationRepository.createAll(townDistrictsInsert)
  }

  reSyncDefaultSubDistrictVietNam = async (townDistrictList: Location[]) => {
    const subDistrictsInsert: Location[] = new Array();

    townDistrictList.map(townDistrict => {
      const defaultSubDistrict = this.defaultSubDistrictVietNam.filter(subDistrict => subDistrict.parent_code === townDistrict.info.code)
      const newSubDistrictList = defaultSubDistrict.map(subDistrict => {
        return new Location({
          name: `${subDistrict.name}`,
          type: Location.TYPE.SUB_DISTRICT,
          parentId: townDistrict.id,
          description: `${subDistrict.name_with_type}`,
          info: {
            code: `${subDistrict.code}`,
            parentCode: `${townDistrict.info.code}`,
            countryCode: `${townDistrict.info.countryCode}`
          }
        })
      })
      subDistrictsInsert.push(...newSubDistrictList)
    })

    await this.locationRepository.createAll(subDistrictsInsert)
  }
}
