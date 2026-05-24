import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserEntries } from '../config/users';
import { Card, Button, FormField } from '@/ui';

const USERS = getUserEntries().map(([id, name]) => ({ id, name }));

export function LoginPopup() {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Vui lòng chọn người dùng');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(selectedUser, password);
    if (!success) {
      setError('Mật khẩu không đúng');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg) px-4 py-8">
      <Card className="w-full max-w-[420px] p-6 shadow-[var(--shadow)]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-(--text)">Bạn là ai?</label>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u.id)}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus) ${
                    selectedUser === u.id
                      ? 'border-(--btn) bg-(--ac-state) text-(--text)'
                      : 'border-(--border) bg-(--surface-raised) text-(--text-muted) hover:bg-(--clr) hover:text-(--text)'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <FormField
              label="Mật khẩu nhóm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="text-base"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-md bg-(--err-state) p-2 text-center text-sm font-medium text-(--err)">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
