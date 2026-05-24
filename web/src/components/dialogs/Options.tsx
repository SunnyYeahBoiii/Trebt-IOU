import type { BillDto } from "@/dtos/bill.dto";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { idsToNames } from "@/helper/idToName.helper";
import { api } from "@/lib/api";
import { useState } from "react";
import { EditDialog } from "./EditDialog";
import loadingGif from "@/assets/icons8-loading.png";
import { showToast } from "../../../lib/toast";
import { Dialog, Button, Stack } from "../../../ui";

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
                    <div className="absolute inset-0 bg-(--bg) opacity-70 backdrop-blur-md"></div>
                    <div className="relative flex flex-col items-center z-[101]">
                        <img
                            src={loadingGif}
                            alt="loading"
                            style={{ width: '50px', height: '50px' }}
                            className="animate-spin mb-2"
                        />
                        <p className="font-medium text-white">Sending data to server</p>
                    </div>
                </div>
            )}

            <Dialog open={true} onClose={closeDialog} title="More Options">
                <Stack gap="sm">
                    <ul className="text-left">
                        <li>Chủ nợ: {idsToNames(data?.creditorId)}</li>
                        <li>Người nợ: {idsToNames(data?.debtorIDs)}</li>
                        <li>Số tiền: {addDotsToMoney(data?.totalAmount)}</li>
                        <li>Ghi chú: {data?.description}</li>
                        <li>Ngày tạo: {new Date(data.createdAt as Date).toLocaleDateString('vi-VN')}</li>
                        <li>Lần cập nhật gần nhất: {new Date(data.updatedAt as Date).toLocaleDateString('vi-VN')}</li>
                    </ul>

                    <Stack direction="horizontal" justify="between" gap="sm">
                        <Button
                            variant="primary"
                            onClick={() => { if (!redeemDialog) { toggleEditBill(true); } }}
                        >
                            Chỉnh nợ
                        </Button>
                        <Button variant="danger" onClick={() => toggleRedeem(true)}>
                            Xóa nợ
                        </Button>
                        <Button variant="secondary" onClick={() => { if (!redeemDialog) { closeDialog(); } }}>
                            Tắt Dialog
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
