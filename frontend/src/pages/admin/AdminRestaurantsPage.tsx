import { useMemo, useState, type FormEvent } from "react";

import { useAdminRestaurants } from "../../hooks/useAdminRestaurants";
import {
    type AdminRestaurantListQuery,
    createRestaurant,
    updateRestaurant,
    softDeleteRestaurant,
    restoreRestaurant,
    permanentlyDeleteRestaurant,
    type RestaurantInput
} from "../../services/admin.service";
import type { Restaurant } from "../../types/api";


export function AdminRestaurantsPage() {
    const [searchInput, setSearchInput] = useState("");
    const [q, setQ] = useState("");
    const [borough, setBorough] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [status, setStatus] =
        useState<"all" | "active" | "inactive">("all");
    const [sort, setSort] =
        useState<"name" | "rating" | "reviews">("name");
    const [page, setPage] = useState(1);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const [newRestaurant, setNewRestaurant] = useState<RestaurantInput>({
        restaurantId: "",
        name: "",
        cuisine: "",
        borough: "",
        address: {
            building: "",
            street: "",
            zipcode: "",
        },
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<RestaurantInput | null>(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editError, setEditError] = useState("");

    const [actionInProgressId, setActionInProgressId] =
        useState<string | null>(null);

    const [actionError, setActionError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const query = useMemo<AdminRestaurantListQuery>(
        () => ({
            q: q || undefined,
            borough: borough || undefined,
            cuisine: cuisine || undefined,
            status,
            sort,
            page,
            limit: 20,
        }),
        [q, borough, cuisine, status, sort, page]
    );

    const { data, isLoading, error, refetch } =
        useAdminRestaurants(query);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setQ(searchInput.trim());
        setPage(1);
    }

    function resetFilters() {
        setSearchInput("");
        setQ("");
        setBorough("");
        setCuisine("");
        setStatus("all");
        setSort("name");
        setPage(1);
    }

    function updateRestaurantField(
        field: "restaurantId" | "name" | "cuisine" | "borough",
        value: string
    ) {
        setNewRestaurant((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAddressField(
        field: "building" | "street" | "zipcode",
        value: string
    ) {
        setNewRestaurant((current) => ({
            ...current,
            address: {
                ...current.address,
                [field]: value,
            },
        }));
    }

    async function handleCreateRestaurant(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setCreateError("");
        setIsCreating(true);

        try {
            await createRestaurant({
                restaurantId: newRestaurant.restaurantId.trim(),
                name: newRestaurant.name.trim(),
                cuisine: newRestaurant.cuisine.trim(),
                borough: newRestaurant.borough.trim(),
                address: {
                    ...(newRestaurant.address.building?.trim() && {
                        building: newRestaurant.address.building.trim(),
                    }),
                    street: newRestaurant.address.street.trim(),
                    zipcode: newRestaurant.address.zipcode.trim(),
                },
            });

            setNewRestaurant({
                restaurantId: "",
                name: "",
                cuisine: "",
                borough: "",
                address: {
                    building: "",
                    street: "",
                    zipcode: "",
                },
            });

            setShowCreateForm(false);

            // Reset filters so the newly created restaurant is visible.
            setSearchInput("");
            setQ("");
            setBorough("");
            setCuisine("");
            setStatus("all");
            setSort("name");
            setPage(1);

            refetch();
        } catch (error) {
            setCreateError(
                error instanceof Error
                    ? error.message
                    : "Unable to create restaurant."
            );
        } finally {
            setIsCreating(false);
        }
    }

    function startEditingRestaurant(restaurant: Restaurant) {
        setEditingId(restaurant._id);

        setEditForm({
            restaurantId: restaurant.restaurantId,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            borough: restaurant.borough,
            address: { ...restaurant.address },
        });

        setEditError("");
    }

    function updateEditField(
        field: "name" | "cuisine" | "borough",
        value: string
    ) {
        setEditForm((current) =>
            current ? { ...current, [field]: value } : current
        );
    }

    function updateEditAddressField(
        field: "building" | "street" | "zipcode",
        value: string
    ) {
        setEditForm((current) =>
            current
                ? {
                    ...current,
                    address: {
                        ...current.address,
                        [field]: value,
                    },
                }
                : current
        );
    }

    async function handleUpdateRestaurant(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!editingId || !editForm) return;

        setIsSavingEdit(true);
        setEditError("");

        try {
            await updateRestaurant(editingId, {
                name: editForm.name.trim(),
                cuisine: editForm.cuisine.trim(),
                borough: editForm.borough.trim(),
                address: {
                    ...editForm.address,
                    building: editForm.address.building?.trim() || undefined,
                    street: editForm.address.street.trim(),
                    zipcode: editForm.address.zipcode.trim(),
                },
            });

            setEditingId(null);
            setEditForm(null);
            refetch();
        } catch (error) {
            setEditError(
                error instanceof Error
                    ? error.message
                    : "Unable to update restaurant."
            );
        } finally {
            setIsSavingEdit(false);
        }
    }

    async function handleDeactivateRestaurant(id: string) {
        const confirmed = window.confirm(
            "Deactivate this restaurant? It will no longer appear in public listings."
        );

        if (!confirmed) return;

        setActionInProgressId(id);
        setActionError("");
        setActionMessage("");

        try {
            await softDeleteRestaurant(id);
            setActionMessage("Restaurant deactivated successfully.");
            refetch();
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to deactivate restaurant."
            );
        } finally {
            setActionInProgressId(null);
        }
    }

    async function handleRestoreRestaurant(id: string) {
        setActionInProgressId(id);
        setActionError("");
        setActionMessage("");

        try {
            await restoreRestaurant(id);
            setActionMessage("Restaurant restored successfully.");
            refetch();
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to restore restaurant."
            );
        } finally {
            setActionInProgressId(null);
        }
    }

    async function handlePermanentDeleteRestaurant(id: string) {
        const confirmed = window.confirm(
            "PERMANENTLY DELETE this restaurant?\n\n" +
            "This cannot be undone. Its associated reviews and favorites will also be deleted."
        );

        if (!confirmed) return;

        setActionInProgressId(id);
        setActionError("");
        setActionMessage("");

        try {
            await permanentlyDeleteRestaurant(id);

            setActionMessage("Restaurant permanently deleted.");
            refetch();
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to permanently delete restaurant."
            );
        } finally {
            setActionInProgressId(null);
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-neutral-500">
                        Administration
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Restaurant management
                    </h1>
                    <p className="mt-2 text-neutral-600">
                        Search, filter, and review restaurants in the database.
                    </p>
                </div>

                {showCreateForm && (
                    <form
                        onSubmit={handleCreateRestaurant}
                        className="mb-8 rounded-xl border border-neutral-200 p-6"
                    >
                        <h2 className="text-xl font-semibold">Add a restaurant</h2>
                        <p className="mt-2 text-sm text-neutral-600">
                            Enter the restaurant details. It will be created as active.
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="text-sm">
                                <span className="mb-1 block">Restaurant ID</span>
                                <input
                                    required
                                    value={newRestaurant.restaurantId}
                                    onChange={(event) =>
                                        updateRestaurantField("restaurantId", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Name</span>
                                <input
                                    required
                                    value={newRestaurant.name}
                                    onChange={(event) =>
                                        updateRestaurantField("name", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Cuisine</span>
                                <input
                                    required
                                    value={newRestaurant.cuisine}
                                    onChange={(event) =>
                                        updateRestaurantField("cuisine", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Borough</span>
                                <input
                                    required
                                    value={newRestaurant.borough}
                                    onChange={(event) =>
                                        updateRestaurantField("borough", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Building (optional)</span>
                                <input
                                    value={newRestaurant.address.building ?? ""}
                                    onChange={(event) =>
                                        updateAddressField("building", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Street</span>
                                <input
                                    required
                                    value={newRestaurant.address.street}
                                    onChange={(event) =>
                                        updateAddressField("street", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">ZIP code</span>
                                <input
                                    required
                                    value={newRestaurant.address.zipcode}
                                    onChange={(event) =>
                                        updateAddressField("zipcode", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>
                        </div>

                        {createError && (
                            <p role="alert" className="mt-4 text-sm text-red-700">
                                {createError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="mt-5 rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white disabled:opacity-50"
                        >
                            {isCreating ? "Creating..." : "Create restaurant"}
                        </button>
                    </form>
                )}

                {editingId && editForm && (
                    <form
                        onSubmit={handleUpdateRestaurant}
                        className="mb-8 rounded-xl border border-neutral-200 p-6"
                    >
                        <h2 className="text-xl font-semibold">Edit restaurant</h2>
                        <p className="mt-2 text-sm text-neutral-500">
                            Restaurant ID: {editForm.restaurantId}
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="text-sm">
                                <span className="mb-1 block">Name</span>
                                <input
                                    required
                                    value={editForm.name}
                                    onChange={(event) =>
                                        updateEditField("name", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Cuisine</span>
                                <input
                                    required
                                    value={editForm.cuisine}
                                    onChange={(event) =>
                                        updateEditField("cuisine", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Borough</span>
                                <input
                                    required
                                    value={editForm.borough}
                                    onChange={(event) =>
                                        updateEditField("borough", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Building</span>
                                <input
                                    value={editForm.address.building ?? ""}
                                    onChange={(event) =>
                                        updateEditAddressField("building", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">Street</span>
                                <input
                                    required
                                    value={editForm.address.street}
                                    onChange={(event) =>
                                        updateEditAddressField("street", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block">ZIP code</span>
                                <input
                                    required
                                    value={editForm.address.zipcode}
                                    onChange={(event) =>
                                        updateEditAddressField("zipcode", event.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                                />
                            </label>
                        </div>

                        {editError && (
                            <p role="alert" className="mt-4 text-sm text-red-700">
                                {editError}
                            </p>
                        )}

                        <div className="mt-5 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSavingEdit}
                                className="rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white disabled:opacity-50"
                            >
                                {isSavingEdit ? "Saving..." : "Save changes"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setEditForm(null);
                                    setEditError("");
                                }}
                                className="rounded-lg border border-neutral-300 px-5 py-3"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <button
                    type="button"
                    onClick={() => {
                        setShowCreateForm((current) => !current);
                        setCreateError("");
                    }}
                    className="rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white"
                >
                    {showCreateForm ? "Cancel" : "Add restaurant"}
                </button>
            </header>

            <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-col gap-3 sm:flex-row"
            >
                <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by name or restaurant ID"
                    aria-label="Search restaurants"
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-4 py-3"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white"
                >
                    Search
                </button>
            </form>

            <section
                aria-label="Restaurant filters"
                className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
                <label className="text-sm">
                    <span className="mb-1 block">Borough</span>
                    <input
                        value={borough}
                        onChange={(event) => {
                            setBorough(event.target.value);
                            setPage(1);
                        }}
                        placeholder="e.g. Bronx"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    />
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Cuisine</span>
                    <input
                        value={cuisine}
                        onChange={(event) => {
                            setCuisine(event.target.value);
                            setPage(1);
                        }}
                        placeholder="e.g. Bakery"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    />
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Status</span>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(
                                event.target.value as
                                | "all"
                                | "active"
                                | "inactive"
                            );
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="all">All restaurants</option>
                        <option value="active">Active only</option>
                        <option value="inactive">Inactive only</option>
                    </select>
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Sort by</span>
                    <select
                        value={sort}
                        onChange={(event) => {
                            setSort(
                                event.target.value as
                                | "name"
                                | "rating"
                                | "reviews"
                            );
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="name">Name</option>
                        <option value="rating">Highest rated</option>
                        <option value="reviews">Most reviewed</option>
                    </select>
                </label>
            </section>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">
                    {data
                        ? `${data.pagination.total} restaurants found`
                        : "Restaurant results"}
                </p>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm underline underline-offset-4"
                >
                    Clear filters
                </button>
            </div>

            {actionMessage && (
                <p role="status" className="mb-4 text-sm text-green-700">
                    {actionMessage}
                </p>
            )}

            {actionError && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                    {actionError}
                </p>
            )}

            {isLoading && (
                <p role="status" className="py-8 text-center">
                    Loading restaurants...
                </p>
            )}

            {error && !isLoading && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 p-5"
                >
                    <p>Unable to load restaurants: {error.message}</p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-3 underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isLoading && !error && data && (
                <>
                    {data.results.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 p-10 text-center">
                            <h2 className="text-lg font-semibold">
                                No restaurants found
                            </h2>
                            <p className="mt-2 text-sm text-neutral-600">
                                Try adjusting your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-neutral-200">
                            <table className="w-full min-w-190 text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-600">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">
                                            Restaurant
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Cuisine
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Borough
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Rating
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-200">
                                    {data.results.map((restaurant) => (
                                        <tr key={restaurant._id}>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-neutral-950">
                                                    {restaurant.name}
                                                </p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    ID: {restaurant.restaurantId}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                {restaurant.cuisine}
                                            </td>

                                            <td className="px-5 py-4">
                                                {restaurant.borough}
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {Number(
                                                    restaurant.avgScore
                                                ).toFixed(1)}{" "}
                                                / 5
                                                <span className="ml-1 text-neutral-500">
                                                    ({restaurant.scoreCount})
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={
                                                        restaurant.isActive
                                                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800"
                                                            : "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                                                    }
                                                >
                                                    {restaurant.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditingRestaurant(restaurant)}
                                                        className="font-medium underline underline-offset-4"
                                                    >
                                                        Edit
                                                    </button>

                                                    {restaurant.isActive ? (
                                                        <button
                                                            type="button"
                                                            disabled={actionInProgressId === restaurant._id}
                                                            onClick={() => {
                                                                void handleDeactivateRestaurant(restaurant._id);
                                                            }}
                                                            className="font-medium text-red-700 underline underline-offset-4 disabled:opacity-50"
                                                        >
                                                            {actionInProgressId === restaurant._id
                                                                ? "Processing..."
                                                                : "Deactivate"}
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={actionInProgressId === restaurant._id}
                                                                onClick={() => {
                                                                    void handleRestoreRestaurant(restaurant._id);
                                                                }}
                                                                className="font-medium text-green-700 underline underline-offset-4 disabled:opacity-50"
                                                            >
                                                                {actionInProgressId === restaurant._id
                                                                    ? "Processing..."
                                                                    : "Restore"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={actionInProgressId === restaurant._id}
                                                                onClick={() => {
                                                                    void handlePermanentDeleteRestaurant(restaurant._id);
                                                                }}
                                                                className="font-medium text-red-700 underline underline-offset-4 disabled:opacity-50"
                                                            >
                                                                {actionInProgressId === restaurant._id
                                                                    ? "Processing..."
                                                                    : "Delete permanently"}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {data.pagination.totalPages > 1 && (
                        <nav
                            aria-label="Restaurant pagination"
                            className="mt-6 flex flex-wrap items-center justify-center gap-4"
                        >
                            <button
                                type="button"
                                disabled={
                                    !data.pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    setPage((current) => current - 1)
                                }
                                className="rounded-lg border border-neutral-300 px-4 py-2 disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-neutral-600">
                                Page {data.pagination.page} of{" "}
                                {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={!data.pagination.hasNextPage}
                                onClick={() =>
                                    setPage((current) => current + 1)
                                }
                                className="rounded-lg border border-neutral-300 px-4 py-2 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}