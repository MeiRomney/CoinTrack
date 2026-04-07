import { Heading, Subheading, Badge, Button, Text } from "../components/ui";

export default function UIShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Heading level={1}>Component Showcase</Heading>
      <Subheading>Available UI Components</Subheading>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Badges</h2>
        <div className="flex gap-2">
          <Badge color="red">Red</Badge>
          <Badge color="green">Green</Badge>
          <Badge color="blue">Blue</Badge>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Buttons</h2>
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button color="blue">Blue</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Text</h2>
        <Text>Regular body text</Text>
      </section>
    </div>
  );
}
