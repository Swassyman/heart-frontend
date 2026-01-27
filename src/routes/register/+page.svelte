<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    let activeTab = $state("owner");
</script>

<div
    class="flex items-center justify-center min-h-screen bg-muted/40 p-4 py-10"
>
    <div class="w-full max-w-lg space-y-6">
        <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p class="text-muted-foreground">Select your role to get started</p>
        </div>

        <Tabs.Root value="owner" class="w-full">
            <Tabs.List class="grid w-full grid-cols-3">
                <Tabs.Trigger value="owner">Owner/Buyer</Tabs.Trigger>
                <Tabs.Trigger value="contractor">Contractor</Tabs.Trigger>
                <Tabs.Trigger value="inspector">Inspector</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="owner">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Owner / Buyer</Card.Title>
                        <Card.Description>
                            Create an account to manage your properties and
                            projects.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button class="w-full">Create Account</Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="contractor">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Contractor</Card.Title>
                        <Card.Description>
                            Join to bid on projects and manage renovations.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="c-name">Company / Full Name</Label>
                            <Input
                                id="c-name"
                                placeholder="Acme Construction"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="c-email">Email</Label>
                            <Input
                                id="c-email"
                                type="email"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="c-password">Password</Label>
                            <Input id="c-password" type="password" />
                        </div>
                        <Button class="w-full">Create Account</Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="inspector">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Inspector</Card.Title>
                        <Card.Description>
                            Verify properties and provide official assessments.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="i-name">Full Name</Label>
                            <Input id="i-name" placeholder="Jane Smith" />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-email">Email</Label>
                            <Input
                                id="i-email"
                                type="email"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-password">Password</Label>
                            <Input id="i-password" type="password" />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-credential"
                                >Government Credential / License ID</Label
                            >
                            <Input
                                id="i-credential"
                                placeholder="Lic-12345678"
                            />
                            <p class="text-[0.8rem] text-muted-foreground">
                                Required to verify your inspector status.
                            </p>
                        </div>
                        <Button class="w-full">Create Account</Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>

        <p class="text-center text-sm text-muted-foreground">
            Already have an account?
            <a href="/login" class="text-primary font-medium hover:underline"
                >Sign In</a
            >
        </p>
    </div>
</div>
