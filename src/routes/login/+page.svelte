<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
</script>

<div class="flex items-center justify-center min-h-screen bg-muted/40 p-4">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title
                class="text-2xl font-semibold tracking-tight text-center"
                >Welcome Back</Card.Title
            >
            <Card.Description class="text-center">
                Enter your credentials to access your account
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <form class="space-y-4">
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
                <Button href="/dashboard" class="w-full">Sign In</Button>
            </form>
        </Card.Content>
        <Card.Footer class="flex justify-center border-t p-4 mt-4">
            <p class="text-sm text-muted-foreground">
                Don't have an account?
                <a
                    href="/register"
                    class="text-primary font-medium hover:underline px-1"
                    >Register</a
                >
            </p>
        </Card.Footer>
    </Card.Root>
</div>
