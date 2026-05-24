import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { Card, FormGroup, Button, Stack } from "@/ui";
import { getUserEntries } from "@/config/users";

const USER_OPTIONS = getUserEntries().map(([id, name]) => ({ id, label: name }));

export function Filter() {
    const [creditors, setCreditors] = useState<string[]>([]);
    const [debtors, setDebtors] = useState<string[]>([]);
    const [queryLink, setQueryLink] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setQueryLink(`creditorIds=${creditors.join(',')}&debtorIds=${debtors.join(',')}`);
    };

    return (
        <>
            <Card className="mx-auto mb-5 max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <Stack gap="lg">
                        <FormGroup
                            label="Chủ nợ"
                            name="creditorFilter"
                            options={USER_OPTIONS}
                            selected={creditors}
                            onChange={setCreditors}
                        />
                        <FormGroup
                            label="Người nợ"
                            name="debtorFilter"
                            options={USER_OPTIONS}
                            selected={debtors}
                            onChange={setDebtors}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" variant="primary" className="w-full sm:w-auto">
                                Áp dụng lọc
                            </Button>
                        </div>
                    </Stack>
                </form>
            </Card>

            {queryLink && (
                <Dashboard linkQuery={queryLink} />
            )}
        </>
    );
}
