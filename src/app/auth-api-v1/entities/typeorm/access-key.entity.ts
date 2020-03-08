import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'access_key',
})
export class AccessKeyEntity {
    @PrimaryColumn({
        name: 'access_key_id',
    })
    public accessKeyId: number;

    @Column({
        name: 'access_key_value',
    })
    public accessKeyValue: string;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    public updatedAt: Date;

    @Column('timestamp', {
        nullable: true,
        name: 'deleted_at',
    })
    public deletedAt: Date | null;
}
