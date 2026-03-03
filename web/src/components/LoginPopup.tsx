import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const USERS = [
  { id: '1', name: 'Phương' },
  { id: '2', name: 'Pha' },
  { id: '3', name: 'Thịnh' },
  { id: '4', name: 'Tuấn' },
];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-(--btn) rounded-2xl p-8 w-[90vw] max-w-[400px] shadow-2xl">
        <h1 className="text-center mb-2">Sổ Thơ Nụ</h1>
        <p className="text-center text-sm opacity-70 mb-6">Đăng nhập để tiếp tục</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm">Bạn là ai?</label>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer text-base ${
                    selectedUser === u.id
                      ? 'bg-(--ac-state) text-black scale-105'
                      : 'bg-(--clr) hover:scale-105'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm">Mật khẩu nhóm</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-(--clr) outline-none text-base"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && (
            <p className="text-center mb-4 text-sm p-2 rounded-lg bg-(--err-state)/30 text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-(--ac-state) text-black font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer text-base"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
