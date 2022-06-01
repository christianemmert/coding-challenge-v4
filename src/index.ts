import { OrganisationUnit, OrganisationUnitConfig } from "./classes";
import { get_fixed_membership_fee_amount, pence_to_pound, pound_to_pence } from "./utils";
import assert from "assert";

/**
 *
 * @param rent_amount - in pounds
 * @param rent_period - month | week
 * @param organisation_unit - Organization unit
 * @returns - Membership fee
 */
export const calculate_membership_fee = (rent_amount: number, rent_period: "week" | "month", organisation_unit: OrganisationUnit): number => {
    assert(process.env.MIN_WEEK_RENT_AMOUNT, new Error("Missing environment variable MIN_WEEK_RENT_AMOUNT"));
    assert(process.env.MAX_WEEK_RENT_AMOUNT, new Error("Missing environment variable MAX_WEEK_RENT_AMOUNT"));
    assert(process.env.MIN_MONTH_RENT_AMOUNT, new Error("Missing environment variable MIN_MONTH_RENT_AMOUNT"));
    assert(process.env.MIN_MONTH_RENT_AMOUNT, new Error("Missing environment variable MAX_MONTH_RENT_AMOUNT"));
    assert(process.env.MIN_MEMBERSHIP_FEE, new Error("Missing environment variable MIN_MEMBERSHIP_FEE"));
    assert(1 <= rent_amount && rent_amount <= Number.MAX_VALUE, new Error("Invalid rent amount. Expected value between 1 and Number.MAX_VALUE"));

    rent_amount = pound_to_pence(rent_amount);
    const vat = (process.env.VAT ? Number(process.env.VAT) : 20) / 100;
    const min_membership_fee = pound_to_pence(Number(process.env.MIN_MEMBERSHIP_FEE));

    if (rent_period === "week") {
        assert(
            pound_to_pence(Number(process.env.MIN_WEEK_RENT_AMOUNT)) <= rent_amount,
            new Error(`Minimum rent amount per week undercuts ${process.env.MIN_WEEK_RENT_AMOUNT}£`)
        );
        assert(
            rent_amount <= pound_to_pence(Number(process.env.MAX_WEEK_RENT_AMOUNT)),
            new Error(`Maximum rent amount per week exceeds ${process.env.MAX_WEEK_RENT_AMOUNT}`)
        );
    }

    if (rent_period === "month") {
        assert(
            pound_to_pence(Number(process.env.MIN_MONTH_RENT_AMOUNT)) <= rent_amount,
            new Error(`Minimum rent amount per week undercuts ${process.env.MIN_MONTH_RENT_AMOUNT}£`)
        );
        assert(
            rent_amount <= pound_to_pence(Number(process.env.MAX_WEEK_RENT_AMOUNT)),
            new Error(`Maximum rent amount per week exceeds ${process.env.MAX_MONTH_RENT_AMOUNT}`)
        );
    }

    let membership_fee = rent_period === "week" ? rent_amount + rent_amount * vat : rent_amount / 4 + (rent_amount / 4) * vat;

    if (rent_amount < min_membership_fee) {
        membership_fee = min_membership_fee + min_membership_fee * vat;
    }

    const fixed_membership_fee_amount = get_fixed_membership_fee_amount(organisation_unit);

    if (fixed_membership_fee_amount !== 0) {
        membership_fee = fixed_membership_fee_amount;
    }

    return pence_to_pound(membership_fee);
};
