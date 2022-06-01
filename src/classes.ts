import { pound_to_pence } from "./utils";

export class OrganisationUnit {
    private subdivision: OrganisationUnit[] = [];

    /**
     *
     * @param name - Organization name
     * @param config - Organization's config
     * @param parent_division - Organisation unit's parent division
     */
    constructor(private name: string, private config: OrganisationUnitConfig | null = null, private parent_division: OrganisationUnit | null = null) {
        this.name = name;
        this.config = config;
        this.parent_division = parent_division;
    }

    /**
     *
     * @returns - Organisation name
     */
    public get_name(): string {
        return this.name;
    }

    /**
     *
     * @returns - Organisation config
     */
    public get_config(): OrganisationUnitConfig | null {
        return this.config;
    }

    /**
     *
     * @returns - Organisation unit's parent division
     */
    public get_parent_division(): OrganisationUnit | null {
        return this.parent_division;
    }

    /**
     *
     * @returns - Organization unit's subdivisions
     */
    public get_subdivision(): OrganisationUnit[] {
        return this.subdivision;
    }

    /**
     * Add unique subdivision's to a division
     * @param subdivision
     */
    public add_subdivision(subdivision: OrganisationUnit): void {
        this.get_subdivision().map((e) => {
            if (e === subdivision) {
                throw new Error("Can't add duplicate organizational unit to subdivision.");
            }
        });
        this.subdivision.push(subdivision);
    }
}

export class OrganisationUnitConfig {
    /**
     *
     * @param has_fixed_membership_fee - Fixed membership fee config
     * @param fixed_membership_fee_amount - Fixed membership fee
     */
    constructor(private has_fixed_membership_fee: boolean, private fixed_membership_fee_amount: number) {
        this.has_fixed_membership_fee = has_fixed_membership_fee;
        this.fixed_membership_fee_amount = fixed_membership_fee_amount;
    }

    /**
     *
     * @returns - Fixed membership fee config
     */
    public get_has_fixed_membership(): boolean {
        return this.has_fixed_membership_fee;
    }

    /**
     *
     * @returns - Fixed membership fee
     */
    public get_fixed_membership_fee_amount(): number {
        return this.fixed_membership_fee_amount;
    }
}
