import type { FormEvent } from "react";
import type { RestaurantInput } from "../services/admin.service";
import { buttonStyles, fieldStyles } from "./ui/styles";
type RestaurantField = "name" | "cuisine" | "borough";
type AddressField = "building" | "street" | "zipcode";
interface Props {
    mode: "create" | "edit";
    values: RestaurantInput;
    busy: boolean;
    error: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onFieldChange: (field: RestaurantField, value: string) => void;
    onAddressChange: (field: AddressField, value: string) => void;
    onIdChange?: (value: string) => void;
}
const fields: { key: RestaurantField; label: string }[] = [{ key: "name", label: "Name" }, { key: "cuisine", label: "Cuisine" }, { key: "borough", label: "Borough" }];
const addressFields: { key: AddressField; label: string }[] = [{ key: "building", label: "Building (optional)" }, { key: "street", label: "Street" }, { key: "zipcode", label: "ZIP code" }];
export function RestaurantEditorForm({ mode, values, busy, error, onSubmit, onCancel, onFieldChange, onAddressChange, onIdChange }: Props) {
    const creating = mode === "create";
    return <form onSubmit={onSubmit}>
        <p className="text-sm text-neutral-600">{creating ? "Enter the restaurant details. It will be created as active." : `Restaurant ID: ${values.restaurantId}`}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {creating && <label className="text-sm"><span className="mb-1 block">Restaurant ID</span><input autoFocus required value={values.restaurantId} onChange={event => onIdChange?.(event.target.value)} className={fieldStyles} /></label>}
            {fields.map(({ key, label }) => <label key={key} className="text-sm"><span className="mb-1 block">{label}</span><input autoFocus={!creating && key === "name"} required value={values[key]} onChange={event => onFieldChange(key, event.target.value)} className={fieldStyles} /></label>)}
            {addressFields.map(({ key, label }) => <label key={key} className="text-sm"><span className="mb-1 block">{label}</span><input required={key !== "building"} value={values.address[key] ?? ""} onChange={event => onAddressChange(key, event.target.value)} className={fieldStyles} /></label>)}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button type="button" disabled={busy} onClick={onCancel} className={buttonStyles("secondary")}>Cancel</button>
            <button type="submit" disabled={busy} className={buttonStyles("primary")}>{busy ? creating ? "Creating…" : "Saving…" : creating ? "Create restaurant" : "Save changes"}</button>
        </div>
    </form>;
}
