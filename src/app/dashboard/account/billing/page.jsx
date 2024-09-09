import { CheckIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid'
import { auth } from '@/auth'
import { getUserPlan } from "@/server-actions/plans"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DollarSign } from 'lucide-react'

const pricing = {
    frequencies: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'annually', label: 'Annually' },
    ],
    tiers: [
        {
            name: 'starter',
            id: 'tier-starter',
            href: '#',
            featured: true,
            description: 'All your essential business finances, taken care of.',
            price: { monthly: '$60', annually: '$648' },
            mainFeatures: ['Basic invoicing', 'Easy to use accounting', 'Mutli-accounts'],
            paymentLinks : {
                monthly_plan_pay_link : process.env.STRIPE_VITERBI_MONTHLY_PROFESSIONAL_PLAN_LINK,
                annually_plan_pay_link : process.env.STRIPE_VITERBI_MONTHLY_PROFESSIONAL_PLAN_LINK,
            },
        },
        {
            name: 'professional',
            id: 'tier-scale',
            href: '#',
            featured: false,
            description: 'The best financial services for your thriving business.',
            price: { monthly: '$250', annually: '$2700' },
            mainFeatures: [
                'Advanced invoicing',
                'Easy to use accounting',
                'Mutli-accounts',
                'Tax planning toolkit',
                'VAT & VATMOSS filing',
                'Free bank transfers',
            ],
            paymentLinks : {
                monthly_plan_pay_link : process.env.STRIPE_VITERBI_MONTHLY_PROFESSIONAL_PLAN_LINK,
                annually_plan_pay_link : process.env.STRIPE_VITERBI_YEARLY_PROFESSIONAL_PLAN_LINK,
            },
        },
        {
            name: 'enterprise',
            id: 'tier-growth',
            href: '#',
            featured: false,
            description: 'Convenient features to take your business to the next level.',
            price: { monthly: '$500', annually: '$5400' },
            mainFeatures: ['Basic invoicing', 'Easy to use accounting', 'Mutli-accounts', 'Tax planning toolkit'],
            paymentLinks : {
                monthly_plan_pay_link : process.env.STRIPE_VITERBI_MONTHLY_ENTERPRISE_PLAN_LINK,
                annually_plan_pay_link : process.env.STRIPE_VITERBI_YEARLY_ENTERPRISE_PLAN_LINK,
            },
        },
    ],
    sections: [
        {
            name: 'Catered for business',
            features: [
                { name: 'Tax Savings', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Easy to use accounting', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Multi-accounts', tiers: { Starter: '3 accounts', Scale: 'Unlimited accounts', Growth: '7 accounts' } },
                { name: 'Invoicing', tiers: { Starter: '3 invoices', Scale: 'Unlimited invoices', Growth: '10 invoices' } },
                { name: 'Exclusive offers', tiers: { Starter: false, Scale: true, Growth: true } },
                { name: '6 months free advisor', tiers: { Starter: false, Scale: true, Growth: true } },
                { name: 'Mobile and web access', tiers: { Starter: false, Scale: true, Growth: false } },
            ],
        },
        {
            name: 'Other perks',
            features: [
                { name: '24/7 customer support', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Instant notifications', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Budgeting tools', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Digital receipts', tiers: { Starter: true, Scale: true, Growth: true } },
                { name: 'Pots to separate money', tiers: { Starter: false, Scale: true, Growth: true } },
                { name: 'Free bank transfers', tiers: { Starter: false, Scale: true, Growth: false } },
                { name: 'Business debit card', tiers: { Starter: false, Scale: true, Growth: false } },
            ],
        },
    ],
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function PayButton({href, btnTitle, selectedPlan}) {
    if (!selectedPlan) {
        return (
            <Button variant='outline' asChild >
                <Link className='mt-6 w-full' href={href}>{btnTitle}</Link>
            </Button>
        )
    } else {
        return (
            <Button variant='outline' className='border-indigo-600' asChild >
                <Link className='mt-6 w-full text-indigo-600' href={"#"}>Current plan</Link>
            </Button>
        )
    }
}

export default async function Page() {

    const session = await auth()
    const user_plan = await getUserPlan()
    console.log("USER PLAN: ", user_plan)

    return (
        <div>
            {/* Header */}

            <Tabs defaultValue="monthly">
                <div className="flex mt-8 justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="annually">Annually</TabsTrigger>
                    </TabsList>
                    <Button variant='outline' asChild>
                        <div>
                            <DollarSign className="mr-2 h-4 w-4" />
                            <Link href={process.env.STRIPE_BILLNG_PORTAL_LINK}>
                                Billing portal
                            </Link>
                        </div>
                    </Button>
                </div>
                <TabsContent value="monthly" >
                    <main main>
                        {/* Pricing section */}
                        <div className="isolate overflow-hidden">

                            <div className="relative">
                                <div className="mx-auto max-w-7xl   sm:py-2 ">
                                    {/* Feature comparison (up to lg) */}
                                    <section aria-labelledby="mobile-comparison-heading" className="lg:hidden">
                                        <h2 id="mobile-comparison-heading" className="sr-only">
                                            Feature comparison
                                        </h2>

                                        <div className="mx-auto max-w-2xl space-y-16">
                                            {pricing.tiers.map((tier) => (
                                                <div key={tier.id} className="border-t border-gray-900/10">
                                                    <div
                                                        className={classNames(
                                                            (tier.name === user_plan?.plan && user_plan?.period === 'monthly') ? 'border-indigo-600' : 'border-transparent',
                                                            '-mt-px w-72 border-t-2 pt-10 md:w-80',
                                                        )}
                                                    >
                                                        <h3
                                                            className={classNames(
                                                                (tier.name === user_plan?.plan && user_plan?.period === 'monthly') ? 'text-indigo-600' : 'text-gray-900',
                                                                'text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            {tier.name}
                                                            
                                                        </h3>
                                                        
                                                        <p className="mt-1 text-sm leading-6 text-gray-600">{tier.description}</p>
                                                        <span className="text-4xl font-bold tracking-tight text-gray-900">$50</span>
                                                    </div>

                                                    <div className="mt-10 space-y-10">
                                                        {pricing.sections.map((section) => (
                                                            <div key={section.name}>
                                                                <h4 className="text-sm font-semibold leading-6 text-gray-900">{section.name}</h4>
                                                                
                                                                <div className="relative mt-6">
                                                                    {/* Fake card background */}
                                                                    <div
                                                                        aria-hidden="true"
                                                                        className="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
                                                                    />

                                                                    <div
                                                                        className={classNames(
                                                                            tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                            'relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0',
                                                                        )}
                                                                    >
                                                                        <dl className="divide-y divide-gray-200 text-sm leading-6">
                                                                            {section.features.map((feature) => (
                                                                                <div
                                                                                    key={feature.name}
                                                                                    className="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
                                                                                >
                                                                                    <dt className="pr-4 text-gray-600">{feature.name}</dt>
                                                                                    <dd className="flex items-center justify-end sm:justify-center sm:px-4">
                                                                                        {typeof feature.tiers[tier.name] === 'string' ? (
                                                                                            <span
                                                                                                className={
                                                                                                    tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'font-semibold text-indigo-600' : 'text-gray-900'
                                                                                                }
                                                                                            >
                                                                                                {feature.tiers[tier.name]}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                {feature.tiers[tier.name] === true ? (
                                                                                                    <CheckIcon
                                                                                                        aria-hidden="true"
                                                                                                        className="mx-auto h-5 w-5 text-indigo-600"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <XMarkIconMini
                                                                                                        aria-hidden="true"
                                                                                                        className="mx-auto h-5 w-5 text-gray-400"
                                                                                                    />
                                                                                                )}

                                                                                                <span className="sr-only">
                                                                                                    {feature.tiers[tier.name] === true ? 'Yes' : 'No'}
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                    </dd>
                                                                                </div>
                                                                            ))}
                                                                        </dl>
                                                                    </div>

                                                                    {/* Fake card border */}
                                                                    <div
                                                                        aria-hidden="true"
                                                                        className={classNames(
                                                                            tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                            'pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block',
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Feature comparison (lg+) */}
                                    <section aria-labelledby="comparison-heading" className="hidden lg:block">
                                        <h2 id="comparison-heading" className="sr-only">
                                            Feature comparison
                                        </h2>

                                        <div className="grid grid-cols-4 gap-x-8 border-t border-gray-900/10 before:block">
                                            {pricing.tiers.map((tier, index) => (
                                                <div key={tier.id} aria-hidden="true" className="-mt-px">
                                                    <div
                                                        className={classNames(
                                                            tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'border-indigo-600' : 'border-transparent',
                                                            'border-t-2 pt-10',
                                                        )}
                                                    >
                                                        <p className="text-2xl tracking-tight text-gray-900">{tier.price.monthly}</p>
                                                        <p
                                                            className={classNames(
                                                                tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'text-indigo-600' : 'text-gray-900',
                                                                'text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            {tier.name}
                                                        </p>
                                                        <p className="mt-1 text-sm leading-6 text-gray-600">{tier.description}</p>
                                                        <PayButton href={tier.paymentLinks.monthly_plan_pay_link + `?prefilled_email=${session?.user.email}`} selectedPlan={(tier.name === user_plan?.plan && user_plan?.period === 'monthly')} btnTitle={"Select"}/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="-mt-6 space-y-16">
                                            {pricing.sections.map((section) => (
                                                <div key={section.name}>
                                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">{section.name}</h3>
                                                    <div className="relative -mx-8 mt-10">
                                                        {/* Fake card backgrounds */}
                                                        <div
                                                            aria-hidden="true"
                                                            className="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                                                        >
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                        </div>

                                                        <table className="relative w-full border-separate border-spacing-x-8">
                                                            <thead>
                                                                <tr className="text-left">
                                                                    <th scope="col">
                                                                        <span className="sr-only">Feature</span>
                                                                    </th>
                                                                    {pricing.tiers.map((tier) => (
                                                                        <th key={tier.id} scope="col">
                                                                            <span className="sr-only">{tier.name} tier</span>
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {section.features.map((feature, featureIdx) => (
                                                                    <tr key={feature.name}>
                                                                        <th
                                                                            scope="row"
                                                                            className="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
                                                                        >
                                                                            {feature.name}
                                                                            {featureIdx !== section.features.length - 1 ? (
                                                                                <div className="absolute inset-x-8 mt-3 h-px bg-gray-200" />
                                                                            ) : null}
                                                                        </th>
                                                                        {pricing.tiers.map((tier) => (
                                                                            <td key={tier.id} className="relative w-1/4 px-4 py-0 text-center">
                                                                                <span className="relative h-full w-full py-3">
                                                                                    {typeof feature.tiers[tier.name] === 'string' ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                                tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'font-semibold text-indigo-600' : 'text-gray-900',
                                                                                                'text-sm leading-6',
                                                                                            )}
                                                                                        >
                                                                                            {feature.tiers[tier.name]}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <>
                                                                                            {feature.tiers[tier.name] === true ? (
                                                                                                <CheckIcon aria-hidden="true" className="mx-auto h-5 w-5 text-indigo-600" />
                                                                                            ) : (
                                                                                                <XMarkIconMini
                                                                                                    aria-hidden="true"
                                                                                                    className="mx-auto h-5 w-5 text-gray-400"
                                                                                                />
                                                                                            )}

                                                                                            <span className="sr-only">
                                                                                                {feature.tiers[tier.name] === true ? 'Yes' : 'No'}
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                        {/* Fake card borders */}
                                                        <div
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                                                        >
                                                            {pricing.tiers.map((tier) => (
                                                                <div
                                                                    key={tier.id}
                                                                    className={classNames(
                                                                        tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                        'rounded-lg',
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>


                    </main>
                </TabsContent>
                <TabsContent value="annually">
                    <main main>
                        {/* Pricing section */}
                        <div className="isolate overflow-hidden">

                            <div className="relative">
                                <div className="mx-auto max-w-7xl   sm:py-2 ">
                                    {/* Feature comparison (up to lg) */}
                                    <section aria-labelledby="mobile-comparison-heading" className="lg:hidden">
                                        <h2 id="mobile-comparison-heading" className="sr-only">
                                            Feature comparison
                                        </h2>

                                        <div className="mx-auto max-w-2xl space-y-16">
                                            {pricing.tiers.map((tier) => (
                                                <div key={tier.id} className="border-t border-gray-900/10">
                                                    <div
                                                        className={classNames(
                                                            tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'border-indigo-600' : 'border-transparent',
                                                            '-mt-px w-72 border-t-2 pt-10 md:w-80',
                                                        )}
                                                    >   
                                                        
                                            
                                                        <h3
                                                            className={classNames(
                                                                tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'text-indigo-600' : 'text-gray-900',
                                                                'text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            {tier.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm leading-6 text-gray-600">{tier.description}</p>
                                                    </div>

                                                    <div className="mt-10 space-y-10">
                                                        {pricing.sections.map((section) => (
                                                            <div key={section.name}>
                                                                <h4 className="text-sm font-semibold leading-6 text-gray-900">{section.name}</h4>
                                                                <div className="relative mt-6">
                                                                    {/* Fake card background */}
                                                                    <div
                                                                        aria-hidden="true"
                                                                        className="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
                                                                    />

                                                                    <div
                                                                        className={classNames(
                                                                            tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                            'relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0',
                                                                        )}
                                                                    >
                                                                        <dl className="divide-y divide-gray-200 text-sm leading-6">
                                                                            {section.features.map((feature) => (
                                                                                <div
                                                                                    key={feature.name}
                                                                                    className="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
                                                                                >
                                                                                    <dt className="pr-4 text-gray-600">{feature.name}</dt>
                                                                                    <dd className="flex items-center justify-end sm:justify-center sm:px-4">
                                                                                        {typeof feature.tiers[tier.name] === 'string' ? (
                                                                                            <span
                                                                                                className={
                                                                                                    tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'font-semibold text-indigo-600' : 'text-gray-900'
                                                                                                }
                                                                                            >
                                                                                                {feature.tiers[tier.name]}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                {feature.tiers[tier.name] === true ? (
                                                                                                    <CheckIcon
                                                                                                        aria-hidden="true"
                                                                                                        className="mx-auto h-5 w-5 text-indigo-600"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <XMarkIconMini
                                                                                                        aria-hidden="true"
                                                                                                        className="mx-auto h-5 w-5 text-gray-400"
                                                                                                    />
                                                                                                )}

                                                                                                <span className="sr-only">
                                                                                                    {feature.tiers[tier.name] === true ? 'Yes' : 'No'}
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                    </dd>
                                                                                </div>
                                                                            ))}
                                                                        </dl>
                                                                    </div>

                                                                    {/* Fake card border */}
                                                                    <div
                                                                        aria-hidden="true"
                                                                        className={classNames(
                                                                            tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                            'pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block',
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Feature comparison (lg+) */}
                                    <section aria-labelledby="comparison-heading" className="hidden lg:block">
                                        <h2 id="comparison-heading" className="sr-only">
                                            Feature comparison
                                        </h2>

                                        <div className="grid grid-cols-4 gap-x-8 border-t border-gray-900/10 before:block">
                                            {pricing.tiers.map((tier) => (
                                                <div key={tier.id} aria-hidden="true" className="-mt-px">
                                                    <div
                                                        className={classNames(
                                                            tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'border-indigo-600' : 'border-transparent',
                                                            'border-t-2 pt-10',
                                                        )}
                                                    >
                                                        <p className="text-2xl tracking-tight text-gray-900">{tier.price.annually}</p>
                                                        <p
                                                            className={classNames(
                                                                tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'text-indigo-600' : 'text-gray-900',
                                                                'text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            {tier.name}
                                                        </p>
                                                        <p className="mt-1 text-sm leading-6 text-gray-600">{tier.description}</p>
                                                        <PayButton href={tier.paymentLinks.annually_plan_pay_link + `?prefilled_email=${session?.user?.email}`} selectedPlan={(tier.name === user_plan?.plan && user_plan?.period === 'yearly')}  btnTitle={"Select"}/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="-mt-6 space-y-16">
                                            {pricing.sections.map((section) => (
                                                <div key={section.name}>
                                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">{section.name}</h3>
                                                    <div className="relative -mx-8 mt-10">
                                                        {/* Fake card backgrounds */}
                                                        <div
                                                            aria-hidden="true"
                                                            className="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                                                        >
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                            <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                                                        </div>

                                                        <table className="relative w-full border-separate border-spacing-x-8">
                                                            <thead>
                                                                <tr className="text-left">
                                                                    <th scope="col">
                                                                        <span className="sr-only">Feature</span>
                                                                    </th>
                                                                    {pricing.tiers.map((tier) => (
                                                                        <th key={tier.id} scope="col">
                                                                            <span className="sr-only">{tier.name} tier</span>
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {section.features.map((feature, featureIdx) => (
                                                                    <tr key={feature.name}>
                                                                        <th
                                                                            scope="row"
                                                                            className="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
                                                                        >
                                                                            {feature.name}
                                                                            {featureIdx !== section.features.length - 1 ? (
                                                                                <div className="absolute inset-x-8 mt-3 h-px bg-gray-200" />
                                                                            ) : null}
                                                                        </th>
                                                                        {pricing.tiers.map((tier) => (
                                                                            <td key={tier.id} className="relative w-1/4 px-4 py-0 text-center">
                                                                                <span className="relative h-full w-full py-3">
                                                                                    {typeof feature.tiers[tier.name] === 'string' ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                                tier.name === user_plan?.plan && user_plan?.period === 'monthly' ? 'font-semibold text-indigo-600' : 'text-gray-900',
                                                                                                'text-sm leading-6',
                                                                                            )}
                                                                                        >
                                                                                            {feature.tiers[tier.name]}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <>
                                                                                            {feature.tiers[tier.name] === true ? (
                                                                                                <CheckIcon aria-hidden="true" className="mx-auto h-5 w-5 text-indigo-600" />
                                                                                            ) : (
                                                                                                <XMarkIconMini
                                                                                                    aria-hidden="true"
                                                                                                    className="mx-auto h-5 w-5 text-gray-400"
                                                                                                />
                                                                                            )}

                                                                                            <span className="sr-only">
                                                                                                {feature.tiers[tier.name] === true ? 'Yes' : 'No'}
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                        {/* Fake card borders */}
                                                        <div
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                                                        >
                                                            {pricing.tiers.map((tier) => (
                                                                <div
                                                                    key={tier.id}
                                                                    className={classNames(
                                                                        tier.name === user_plan?.plan && user_plan?.period === 'yearly' ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-900/10',
                                                                        'rounded-lg',
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                    </main>
                </TabsContent>
            </Tabs>
        </div>
    )
}
