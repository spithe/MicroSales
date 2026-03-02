import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <SignIn appearance={{
                elements: {
                    rootBox: 'mx-auto',
                    card: 'bg-slate-900 border border-slate-800 text-slate-100',
                    headerTitle: 'text-slate-100',
                    headerSubtitle: 'text-slate-400',
                    socialButtonsBlockButton: 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700',
                    formFieldLabel: 'text-slate-300',
                    formFieldInput: 'bg-slate-800 border-slate-700 text-slate-100',
                    footerActionLink: 'text-indigo-400 hover:text-indigo-300'
                }
            }} />
        </div>
    );
}
