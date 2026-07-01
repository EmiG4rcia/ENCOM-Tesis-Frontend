import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin, useRecoverPassword } from '../hooks/useAuth'
import { PrimaryButton } from '../components/buttons'

type View = 'login' | 'recover'

export function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('login')

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [recoverForm, setRecoverForm] = useState({ recovery_code: '', new_password: '' })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const login = useLogin()
  const recover = useRecoverPassword()

  const handleLogin = () => {
    setError('')
    login.mutate(loginForm, {
      onSuccess: () => navigate('/'),
      onError: () => setError('Usuario o contraseña incorrectos'),
    })
  }

  const handleRecover = () => {
    setError('')
    recover.mutate(recoverForm, {
      onSuccess: () => {
        setSuccessMessage('Contraseña actualizada correctamente. Iniciá sesión.')
        setView('login')
      },
      onError: () => setError('Código de recuperación incorrecto'),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Jill's Sandwich</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de Administración</p>
        </div>

        {successMessage && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {view === 'login' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Usuario</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <PrimaryButton
              label="Iniciar sesión"
              onClick={handleLogin}
              isLoading={login.isPending}
              size="lg"
            />
            <button
              onClick={() => { setView('recover'); setError('') }}
              className="w-full text-xs text-gray-400 hover:text-blue-600 transition-colors mt-2"
            >
              Olvidé mi contraseña
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Ingresá tu código de recuperación y una nueva contraseña.
            </p>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Código de recuperación</label>
              <input
                type="text"
                value={recoverForm.recovery_code}
                onChange={(e) => setRecoverForm({ ...recoverForm, recovery_code: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: K7mP2xNq"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={recoverForm.new_password}
                onChange={(e) => setRecoverForm({ ...recoverForm, new_password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleRecover()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <PrimaryButton
              label="Recuperar contraseña"
              onClick={handleRecover}
              isLoading={recover.isPending}
              size="lg"
            />
            <button
              onClick={() => { setView('login'); setError('') }}
              className="w-full text-xs text-gray-400 hover:text-blue-600 transition-colors mt-2"
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}