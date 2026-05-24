import type { BillDto } from "@/dtos/bill.dto";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { idsToNames } from "@/helper/idToName.helper";
import { api } from "@/lib/api";
import { useState } from "react";
import { EditDialog } from "./EditDialog";
import { showToast } from "@/lib/toast";
import { Dialog, Button, Spinner, Stack } from "@/ui";

interface DialogProps {
    openEditBill: (data: BillDto) => void;
    closeDialog: () => void;
    data: BillDto,
}

export function Options({ closeDialog, data }: DialogProps) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [showingEditBill, toggleEditBill] = useState<boolean>(false);
    const [redeemDialog, toggleRedeem] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteBill = async (id: string) => {
        const payload = {
            billId: id,
        };

        setIsDeleting(true);
        setLoading(true);
        api.post('/bills/remove', payload)
            .then(() => {
                showToast('Nợ đã được xóa', 'success');
                closeDialog();
                setIsDeleting(false);
                setLoading(false);
            })
            .catch(err => {
                showToast(err?.message || 'Có lỗi xảy ra', 'error');
                setIsDeleting(false);
                setLoading(false);
            });
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-(--bg) opacity-80 backdrop-blur-sm"></div>
                    <div className="relative z-[101] flex flex-col items-center gap-3 rounded-lg border border-(--border) bg-(--surface) px-6 py-5 shadow-[var(--shadow)]">
                        <Spinner />
                        <p className="text-sm font-medium text-(--text-muted)">Đang gửi dữ liệu</p>
                    </div>
                </div>
            )}

            <Dialog open={true} onClose={closeDialog} title="Chi tiết khoản nợ">
                <Stack gap="md">
                    <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
                        <dt className="font-semibold text-(--text-muted)">Chủ nợ</dt>
                        <dd className="font-medium text-(--text)">{idsToNames(data?.creditorId)}</dd>
                        <dt className="font-semibold text-(--text-muted)">Người nợ</dt>
                        <dd className="font-medium text-(--text)">{idsToNames(data?.debtorIDs)}</dd>
                        <dt className="font-semibold text-(--text-muted)">Số tiền</dt>
                        <dd className="font-semibold tabular-nums text-(--text)">{addDotsToMoney(data?.totalAmount)}</dd>
                        <dt className="font-semibold text-(--text-muted)">Ghi chú</dt>
                        <dd className="text-(--text)">{data?.description}</dd>
                        <dt className="font-semibold text-(--text-muted)">Ngày tạo</dt>
                        <dd className="text-(--text)">{data.createdAt ? new Date(data.createdAt as Date).toLocaleDateString('vi-VN') : ""}</dd>
                        <dt className="font-semibold text-(--text-muted)">Cập nhật</dt>
                        <dd className="text-(--text)">{data.updatedAt ? new Date(data.updatedAt as Date).toLocaleDateString('vi-VN') : ""}</dd>
                    </dl>

                    <Stack direction="horizontal" justify="end" gap="sm" wrap>
                        <Button
                            variant="primary"
                            onClick={() => { if (!redeemDialog) { toggleEditBill(true); } }}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button variant="danger" onClick={() => toggleRedeem(true)}>
                            Xóa nợ
                        </Button>
                        <Button variant="secondary" onClick={() => { if (!redeemDialog) { closeDialog(); } }}>
                            Đóng
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>

            {showingEditBill && (
                <EditDialog
                    setLoading={setLoading}
                    closeEditBill={() => toggleEditBill(false)}
                    closeDialog={closeDialog}
                    data={data}
                />
            )}

            {redeemDialog && (
                <Dialog open={true} onClose={() => toggleRedeem(false)} title="Hỏi lại">
                    <Stack gap="md">
                        <p>Bạn có chắc chắn muốn xóa nợ?</p>
                        <Stack direction="horizontal" justify="center" gap="md">
                            <Button variant="danger" onClick={async () => { await deleteBill(data.id as string); }} loading={isDeleting}>
                                Có
                            </Button>
                            <Button variant="secondary" onClick={() => toggleRedeem(false)}>
                                Không
                            </Button>
                        </Stack>
                    </Stack>
                </Dialog>
            )}
        </>
    );
}
