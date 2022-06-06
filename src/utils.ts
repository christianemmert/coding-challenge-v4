import { OrganisationUnit } from "./classes";

/**
 *
 * @param pounds
 * @returns - Pence
 */
export const pound_to_pence = (pounds: number): number => {
    return pounds * 100;
};

/**
 *
 * @param pence
 * @returns - Pound
 */
export const pence_to_pound = (pence: number): number => {
    return pence / 100;
};

/**
 *
 * @param organisation_unit
 * @returns - Fixed membership fee or 0 if no fixed membership fee is set
 */
export const get_fixed_membership_fee_amount = (organisation_unit: OrganisationUnit): number => {
    const parent_division = organisation_unit.get_parent_division();
    const config = organisation_unit.get_config();

    if (!config && parent_division) {
        return get_fixed_membership_fee_amount(parent_division);
    }

    if (config) {
        return config.get_fixed_membership_fee_amount();
    }

    return 0;
};
