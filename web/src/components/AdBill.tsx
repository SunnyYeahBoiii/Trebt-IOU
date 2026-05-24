import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { showToast } from "../../lib/toast";
import { Card, FormGroup, FormField, Button, Stack } from "../../ui";
import { getUserEntries } from "../../config/users";

const USER_OPTIONS = getUserEntries().map(([id, name]) => ({ id, label: name }));

export function AddBill() {
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedCreditor, setSelectedCreditor] = useState<string>("");
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalAmount(parseInt(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            totalAmount: parseInt(totalAmountVal as string),
            billType: "SPLITTING",
        };

        setIsSubmitting(true);
        api.post('/bills/add', Bill)
            .then(() => {
                showToast('Thêm nợ thành công!', 'success');
                setIsSubmitting(false);
            })
            .catch(error => {
                showToast(error?.message || 'Có lỗi xảy ra', 'error');
                setIsSubmitting(false);
            });
    };

    return (
        <Card>
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
                        onChange={handleChangeAmount}
                        className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    {/* Note */}
                    <FormField label="Ghi chú">
                        <textarea
                            name="description"
                            className="h-[100px] w-full bg-(--clr) rounded-sm resize-none px-3 py-2 text-(--text) outline-none focus:ring-2 focus:ring-(--btn)"
                            placeholder="Nhập ghi chú ở đây"
                        />
                    </FormField>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <Button type="submit" variant="primary" loading={isSubmitting}>
                            Thêm hóa đơn
                        </Button>
                    </div>
                </Stack>
            </form>
        </Card>
    );
}
