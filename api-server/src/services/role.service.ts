import { BindingScope, injectable } from "@loopback/core";
import { repository } from "@loopback/repository";
import { RoleRepository } from "../repositories";
import { SystemFileUtils } from "../common/system-utils";

@injectable({scope: BindingScope.TRANSIENT})
export class RoleService {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  async syncRole() {
    const roles = await SystemFileUtils.getConfigs("role.json");
    const rolesCode: string[] = Object.values(roles);
    for (const code of rolesCode) {
      const role = await this.roleRepository.findOne({
        where: {
          code,
        }
      })
      if (role) continue
      await this.roleRepository.create({
        code, 
        name: code 
      })  
    }
  }
}
