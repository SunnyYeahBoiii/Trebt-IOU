import type { BillDto } from "@/dtos/bill.dto";
import { api } from "@/lib/api";
import { useState } from "react";
import { showToast } from "../../../lib/toast";
import { Dialog, FormField, Button, Stack, FormGroup } from "../../../ui";
import { getUserEntries } from "../../../config/users";

const USER_OPTIONS = getUserEntries().map(([id, name]) => ({ id, label: name }));

interface DialogProps {
    setLoading: (state: boolean) => void;
    closeEditBill: () => void;
    closeDialog: () => void;
    data: BillDto,
}

export function EditDialog({ setLoading, closeEditBill, closeDialog, data }: DialogProps) {
    const [totalAmount, setTotalAmount] = useState<number>(data.totalAmount);
    const [selectedCreditor, setSelectedCreditor] = useState<string>(data.creditorId);
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>(data.debtorIDs?.split(',') ?? []);
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
            totalAmount: parseInt(totalAmountVal as string),
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
        <Dialog open={true} onClose={closeDialog} title="Chỉnh sửa Bill">
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    {/* Creditor - radio buttons */}
                    <fieldset className="border border-(--clr) rounded-lg p-3">
                        <legend className="text-sm font-medium text-white px-2">Chủ nợ</legend>
                        <Stack direction="vertical" gap="sm" className="mt-2">
                            {USER_OPTIONS.map((user) => (
                                <label key={user.id} className="flex items-center gap-2 cursor-pointer text-(--text)">
                                    <input
                                        type="radio"
                                        id={`creditor-${user.id}`}
                                        value={user.id}
                                        name="creditor"
                                        checked={selectedCreditor === user.id}
                                        onChange={() => setSelectedCreditor(user.id)}
                                        className="accent-(--btn)"
                                    />
                                    {user.label}
                                </label>
                            ))}
                        </Stack>
                    </fieldset>

                    {/* Debtors - checkboxes */}
                    <FormGroup
                        label="Người nợ"
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
                        onChange={(e) => setTotalAmount(parseInt(e.target.value))}
                        className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    {/* Description */}
                    <FormField label="Ghi chú">
                        <textarea
                            name="description"
                            className="h-[100px] w-full bg-(--clr) rounded-sm resize-none px-3 py-2 text-(--text) outline-none focus:ring-2 focus:ring-(--btn)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormField>

                    {/* Actions */}
                    <Stack direction="horizontal" justify="center" gap="md">
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
