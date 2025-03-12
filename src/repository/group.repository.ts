
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "src/entities/Group.entity";
import { Repository } from "typeorm";

export class GroupRepository extends Repository<Group>{
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
    ) {
        super(groupRepository.target, groupRepository.manager, groupRepository.queryRunner);
    }

    async findByName(name: string): Promise<Group | null> {
        return this.groupRepository.findOne({
            where: {
                name,
            },
        });
    }

    async createGroup(group: Group): Promise<Group> {
        return this.groupRepository.save(group);
    }

    async updateGroup(group: Group): Promise<Group> {
        return this.groupRepository.save(group);
    }
}
