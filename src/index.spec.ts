import assert from "assert";
import { describe, it } from "mocha";
import { calculate_membership_fee } from ".";
import { OrganisationUnit, OrganisationUnitConfig } from "./classes";

const min_membership_fee = Number(process.env.MIN_MEMBERSHIP_FEE);
const vat = (process.env.VAT ? Number(process.env.VAT) : 20) / 100;

const no_fee_config = new OrganisationUnitConfig(false, 0);
const client = new OrganisationUnit("client", no_fee_config);
const division_a = new OrganisationUnit("division_a", no_fee_config, client);
const division_b = new OrganisationUnit("division_b", new OrganisationUnitConfig(true, 35000), client);
const area_a = new OrganisationUnit("area_a", new OrganisationUnitConfig(true, 45000), division_a);
const area_b = new OrganisationUnit("area_b", no_fee_config, division_a);
const area_c = new OrganisationUnit("area_c", new OrganisationUnitConfig(true, 45000), division_b);
const area_d = new OrganisationUnit("area_d", no_fee_config, division_b);
const branch_a = new OrganisationUnit("branch_a", null, area_a);
const branch_b = new OrganisationUnit("branch_b", no_fee_config, area_a);
const branch_c = new OrganisationUnit("branch_c", no_fee_config, area_a);
const branch_d = new OrganisationUnit("branch_d", null, area_a);
const branch_e = new OrganisationUnit("branch_e", no_fee_config, area_b);
const branch_f = new OrganisationUnit("branch_f", no_fee_config, area_b);
const branch_g = new OrganisationUnit("branch_g", no_fee_config, area_b);
const branch_h = new OrganisationUnit("branch_h", no_fee_config, area_b);
const branch_i = new OrganisationUnit("branch_i", no_fee_config, area_c);
const branch_j = new OrganisationUnit("branch_j", no_fee_config, area_c);
const branch_k = new OrganisationUnit("branch_k", new OrganisationUnitConfig(true, 25000), area_c);
const branch_l = new OrganisationUnit("branch_l", no_fee_config, area_c);
const branch_m = new OrganisationUnit("branch_m", null, area_d);
const branch_n = new OrganisationUnit("branch_n", no_fee_config, area_d);
const branch_o = new OrganisationUnit("branch_o", no_fee_config, area_d);
const branch_p = new OrganisationUnit("branch_p", no_fee_config, area_d);

client.add_subdivision(division_a);
client.add_subdivision(division_b);
division_a.add_subdivision(area_a);
division_a.add_subdivision(area_b);
division_b.add_subdivision(area_c);
division_b.add_subdivision(area_d);
area_a.add_subdivision(branch_a);
area_a.add_subdivision(branch_b);
area_a.add_subdivision(branch_c);
area_a.add_subdivision(branch_d);
area_b.add_subdivision(branch_e);
area_b.add_subdivision(branch_f);
area_b.add_subdivision(branch_g);
area_b.add_subdivision(branch_h);
area_c.add_subdivision(branch_i);
area_c.add_subdivision(branch_j);
area_c.add_subdivision(branch_k);
area_c.add_subdivision(branch_l);
area_d.add_subdivision(branch_m);
area_d.add_subdivision(branch_n);
area_d.add_subdivision(branch_o);
area_d.add_subdivision(branch_p);

describe("calculate_membership_fee", () => {
    it("Should throw error: Invalid rent amount", () => {
        assert.throws(() => calculate_membership_fee(Number(process.env.MIN_WEEK_RENT_AMOUNT) - 1, "week", client));
        assert.throws(() => calculate_membership_fee(Number(process.env.MAX_WEEK_RENT_AMOUNT) + 1, "week", client));
        assert.throws(() => calculate_membership_fee(Number(process.env.MIN_MONTH_RENT_AMOUNT) - 1, "month", client));
        assert.throws(() => calculate_membership_fee(Number(process.env.MAX_MONTH_RENT_AMOUNT) + 1, "month", client));
    });
    it("Should return minimum membership fee inkl. VAT", () => {
        assert(calculate_membership_fee(110, "month", client) === min_membership_fee + min_membership_fee * vat);
    });
    it("Should return membership fee equal to one week of rent inkl. VAT", () => {
        const rent = 130;
        assert(calculate_membership_fee(rent, "week", client) === rent + rent * vat);
    });
    it("should return fixed membership fee", () => {
        const rent = 130;
        assert(calculate_membership_fee(rent, "week", branch_a) === 450);
        assert(calculate_membership_fee(rent, "week", branch_k) === 250);
        assert(calculate_membership_fee(rent, "week", branch_m) === rent + rent * vat);
    });
});
