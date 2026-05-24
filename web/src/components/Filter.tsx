import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { Card, FormGroup, Button, Stack } from "../../ui";
import { getUserEntries } from "../../config/users";

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
            <Card className="mb-4">
                <h2 className="text-center mb-3">Filter</h2>
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <FormGroup
                            label="Filter theo Chủ nợ"
                            options={USER_OPTIONS}
                            selected={creditors}
                            onChange={setCreditors}
                        />
                        <FormGroup
                            label="Filter theo Người nợ"
                            options={USER_OPTIONS}
                            selected={debtors}
                            onChange={setDebtors}
                        />
                        <div className="flex justify-center">
                            <Button type="submit" variant="primary">
                                Filter
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
