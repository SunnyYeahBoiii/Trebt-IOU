import type { BillDto } from "@/dtos/bill.dto";
import { api } from "@/lib/api";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { Dialog, FormField, Button, Stack, FormGroup } from "@/ui";
import { getUserEntries } from "@/config/users";

const USER_OPTIONS = getUserEntries().map(([id, name]) => ({ id, label: name }));

interface DialogProps {
    setLoading: (state: boolean) => void;
    closeEditBill: () => void;
    closeDialog: () => void;
    data: BillDto,
}

export function EditDialog({ setLoading, closeEditBill, closeDialog, data }: DialogProps) {
    const [totalAmount, setTotalAmount] = useState<string>(String(data.totalAmount));
    const [selectedCreditor, setSelectedCreditor] = useState<string>(data.creditorId);
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>(
        data.debtorIDs?.split(',').map((id) => id.trim()).filter(Boolean) ?? []
    );
    const [description, setDescription] = useState<string>(data.description ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const creditorId: FormDataEntryValue | null = formData.get('creditor');
        const debtors: FormDataEntryValue[] = formData.getAll('debtor');
        const debtorIDs: string = debtors.join(',');
        const totalAmountVal: FormDataEntryValue | null = formData.get('totalAmount');
        const desc: FormDataEntryValue | null = formData.get('description');

        if (!creditorId || !debtorIDs || !totalAmountVal || totalAmountVal === "0") {
            const message = `${!creditorId ? "Chủ nợ không được phép rỗng!\n" : ""}${!debtorIDs ? "Người nợ bắt buộc phải có 1 người!\n" : ""}${!totalAmountVal || totalAmountVal === "0" ? "Bắt buộc phải có số tiền và khác không!\n" : ""}`;
            showToast(message, "error");
            return;
        }

        const Bill = {
            id: data.id,
            description: desc,
            creditorId: creditorId,
            debtorIDs: debtorIDs,
            totalAmount: parseInt(totalAmountVal as string, 10),
            billType: "SPLITTING",
        };

        setIsSubmitting(true);
        setLoading(true);
        api.post('/bills/edit', Bill)
            .then(() => {
                showToast('Cập nhật thành công!', 'success');
                setIsSubmitting(false);
                setLoading(false);
                closeDialog();
            })
            .catch(error => {
                showToast(error?.message || 'Có lỗi xảy ra', 'error');
                setIsSubmitting(false);
                setLoading(false);
            });
    };

    return (
        <Dialog open={true} onClose={closeDialog} title="Chỉnh sửa khoản nợ">
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
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
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="text-right tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <FormField label="Ghi chú">
                        <textarea
                            name="description"
                            className="min-h-[112px] w-full resize-none rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--focus) focus:ring-1 focus:ring-(--focus)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormField>

                    <Stack direction="horizontal" justify="end" gap="sm" wrap>
                        <Button type="submit" variant="primary" loading={isSubmitting}>
                            Cập nhật
                        </Button>
                        <Button type="button" variant="secondary" onClick={closeEditBill}>
                            Quay lại
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    );
}
