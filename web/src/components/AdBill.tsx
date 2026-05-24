import { useState } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { Card, FormGroup, FormField, Button, Stack } from "@/ui";
import { getUserEntries } from "@/config/users";

const USER_OPTIONS = getUserEntries().map(([id, name]) => ({ id, label: name }));

export function AddBill() {
    const [totalAmount, setTotalAmount] = useState<string>("");
    const [selectedCreditor, setSelectedCreditor] = useState<string>("");
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalAmount(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(e.currentTarget);

        const creditorId: FormDataEntryValue | null = formData.get('creditor');
        const debtors: FormDataEntryValue[] = formData.getAll('debtor');
        const debtorIDs: string = debtors.join(',');
        const totalAmountVal: FormDataEntryValue | null = formData.get('totalAmount');
        const description: FormDataEntryValue | null = formData.get('description');

        if (!creditorId || !debtorIDs || !totalAmountVal || totalAmountVal === "0") {
            const message = `${!creditorId ? "Chủ nợ không được phép rỗng!\n" : ""}${!debtorIDs ? "Người nợ bắt buộc phải có 1 người!\n" : ""}${!totalAmountVal || totalAmountVal === "0" ? "Bắt buộc phải có số tiền và khác không!\n" : ""}`;
            showToast(message, "error");
            return;
        }

        const Bill = {
            description: description,
            creditorId: creditorId,
            debtorIDs: debtorIDs,
            totalAmount: parseInt(totalAmountVal as string, 10),
            billType: "SPLITTING",
        };

        setIsSubmitting(true);
        api.post('/bills/add', Bill)
            .then(() => {
                showToast('Thêm nợ thành công!', 'success');
                form.reset();
                setTotalAmount("");
                setSelectedCreditor("");
                setSelectedDebtors([]);
                setIsSubmitting(false);
            })
            .catch(error => {
                showToast(error?.message || 'Có lỗi xảy ra', 'error');
                setIsSubmitting(false);
            });
    };

    return (
        <Card className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit}>
                <Stack gap="lg">
                    <fieldset className="rounded-lg border border-(--border) bg-(--surface-raised) p-3">
                        <legend className="px-2 text-sm font-semibold text-(--text)">Chủ nợ</legend>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {USER_OPTIONS.map((user) => (
                                <label
                                    key={user.id}
                                    className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-semibold transition-colors ${
                                        selectedCreditor === user.id
                                            ? "border-(--btn) bg-(--ac-state) text-(--text)"
                                            : "border-(--border) bg-(--surface) text-(--text-muted) hover:bg-(--clr) hover:text-(--text)"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        id={`creditor-${user.id}`}
                                        value={user.id}
                                        name="creditor"
                                        checked={selectedCreditor === user.id}
                                        onChange={() => setSelectedCreditor(user.id)}
                                        className="sr-only"
                                    />
                                    {user.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <FormGroup
                        label="Người nợ"
                        name="debtor"
                        options={USER_OPTIONS}
                        selected={selectedDebtors}
                        onChange={setSelectedDebtors}
                    />

                    {/* Amount */}
                    <FormField
                        label="Số tiền"
                        name="totalAmount"
                        type="number"
                        min={0}
                        value={totalAmount}
                        onChange={handleChangeAmount}
                        placeholder="0"
                        className="text-right tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <FormField label="Ghi chú">
                        <textarea
                            name="description"
                            className="min-h-[112px] w-full resize-none rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--focus) focus:ring-1 focus:ring-(--focus)"
                            placeholder="Ví dụ: ăn tối cuối tuần"
                        />
                    </FormField>

                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" loading={isSubmitting} className="w-full sm:w-auto">
                            Thêm hóa đơn
                        </Button>
                    </div>
                </Stack>
            </form>
        </Card>
    );
}
