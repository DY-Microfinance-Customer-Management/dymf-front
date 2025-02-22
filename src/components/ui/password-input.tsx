'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
   ({ className, ...props }, ref) => {
      const [showPassword, setShowPassword] = React.useState(false);
      
      return (
         <div className="relative">
            {/* Input */}
            <Input
               type={showPassword ? 'text' : 'password'}
               className={cn('hide-password-toggle pr-10', className)}
               ref={ref}
               {...props}
            />

            {/* Password Visibility Toggle Button */}
            <Button
               type="button"
               variant="ghost"
               size="sm"
               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
               onClick={() => setShowPassword(prev => !prev)}
               disabled={props.disabled} // 사용자가 입력한 값과 관계없이 버튼을 활성화
            >
               {showPassword ? (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
               ) : (
                  <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
               )}
               <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>

            {/* Hides browser's default password toggle */}
            <style>{`
               .hide-password-toggle::-ms-reveal,
               .hide-password-toggle::-ms-clear {
                  visibility: hidden;
                  pointer-events: none;
                  display: none;
               }
            `}</style>
         </div>
      )
   }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }