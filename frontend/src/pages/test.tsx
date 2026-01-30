// pages/UIShowcase.tsx or app/ui-showcase/page.tsx
import React, { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Heading,
  Subheading,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
  Combobox,
  ComboboxOption,
  ComboboxLabel,
  ComboboxDescription,
  Checkbox,
  CheckboxField,
  CheckboxGroup,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDescription,
  DropdownDivider,
  Listbox,
  ListboxOption,
  ListboxLabel,
  ListboxDescription,
  Radio,
  RadioField,
  RadioGroup,
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
  Divider,
  Fieldset,
  Legend,
  Field,
  Label,
  Description,
  ErrorMessage,
  Select,
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarSpacer,
  NavbarDivider,
  NavbarLabel,
  Sidebar,
  SidebarHeader,
  SidebarHeading,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarFooter,
  SwitchGroup,
  SwitchField,
  Switch,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Text,
  TextLink,
  Strong,
  Code,
  Textarea,
  StandardLayout,
  Avatar,
  AvatarButton,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
  Panel,
} from "../components/ui";
import {
  EnvelopeIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function UIShowcase() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [comboSelected, setComboSelected] = useState<string | null>(null);
  const [listboxSelected, setListboxSelected] = useState<string | null>(null);
  const [selectValue, setSelectValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [dialogOpen, setDialogOpen] = useState(false);

  const comboOptions = ["Apple", "Banana", "Cherry", "Date"];
  const listboxOptions = ["Small", "Medium", "Large", "Extra Large"];

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">UI Component Showcase</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          A comprehensive preview of all available UI components
        </p>
      </div>

      {/* Headings */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Headings</h2>
        <Panel>
          <div className="space-y-4">
            <Heading level={1}>Heading Level 1</Heading>
            <Heading level={2}>Heading Level 2</Heading>
            <Heading level={3}>Heading Level 3</Heading>
            <Subheading>Subheading</Subheading>
          </div>
        </Panel>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Badges</h2>
        <Panel>
          <div className="flex flex-wrap gap-2">
            <Badge color="red">Red</Badge>
            <Badge color="orange">Orange</Badge>
            <Badge color="yellow">Yellow</Badge>
            <Badge color="lime">Lime</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="emerald">Emerald</Badge>
            <Badge color="teal">Teal</Badge>
            <Badge color="cyan">Cyan</Badge>
            <Badge color="sky">Sky</Badge>
            <Badge color="blue">Blue</Badge>
            <Badge color="indigo">Indigo</Badge>
            <Badge color="violet">Violet</Badge>
            <Badge color="purple">Purple</Badge>
            <Badge color="fuchsia">Fuchsia</Badge>
            <Badge color="pink">Pink</Badge>
            <Badge color="rose">Rose</Badge>
            <Badge color="zinc">Zinc</Badge>
          </div>
        </Panel>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Buttons</h2>
        <Panel>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button color="red">Red</Button>
              <Button color="orange">Orange</Button>
              <Button color="amber">Amber</Button>
              <Button color="yellow">Yellow</Button>
              <Button color="lime">Lime</Button>
              <Button color="green">Green</Button>
              <Button color="emerald">Emerald</Button>
              <Button color="teal">Teal</Button>
              <Button color="cyan">Cyan</Button>
              <Button color="sky">Sky</Button>
              <Button color="blue">Blue</Button>
              <Button color="indigo">Indigo</Button>
              <Button color="violet">Violet</Button>
              <Button color="purple">Purple</Button>
              <Button color="fuchsia">Fuchsia</Button>
              <Button color="pink">Pink</Button>
              <Button color="rose">Rose</Button>
              <Button color="zinc">Zinc</Button>
              <Button color="white">White</Button>
            </div>
            <Divider />
            <div className="flex flex-wrap gap-3">
              <Button outline>Outline</Button>
              <Button plain>Plain</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Panel>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Inputs</h2>
        <Panel>
          <div className="space-y-4">
            <Input type="text" placeholder="Text input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="number" placeholder="Number input" />
            <Input type="date" />
            <Input type="text" placeholder="Disabled input" disabled />
          </div>
        </Panel>
      </section>

      {/* Select */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Select</h2>
        <Panel>
          <div className="space-y-4">
            <Select
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="">Choose an option...</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </Select>
            <Select disabled>
              <option>Disabled select</option>
            </Select>
          </div>
        </Panel>
      </section>

      {/* Combobox */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Combobox</h2>
        <Panel>
          <Combobox
            value={comboSelected}
            onChange={setComboSelected}
            options={comboOptions}
            displayValue={(option) => option || ""}
            placeholder="Select a fruit..."
            aria-label="Fruit selection"
          >
            {(option) => (
              <ComboboxOption value={option}>
                <ComboboxLabel>{option}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
          {comboSelected && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Selected: {comboSelected}
            </p>
          )}
        </Panel>
      </section>

      {/* Listbox */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Listbox</h2>
        <Panel>
          <Listbox
            value={listboxSelected}
            onChange={setListboxSelected}
            placeholder="Select size..."
            aria-label="Size selection"
          >
            {listboxOptions.map((option) => (
              <ListboxOption key={option} value={option}>
                <ListboxLabel>{option}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
          {listboxSelected && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Selected: {listboxSelected}
            </p>
          )}
        </Panel>
      </section>

      {/* Checkboxes */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Checkboxes</h2>
        <Panel>
          <CheckboxGroup>
            <CheckboxField>
              <Checkbox
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
              />
              <Label>Accept terms and conditions</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox color="blue" />
              <Label>Blue checkbox</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox color="green" />
              <Label>Green checkbox</Label>
              <Description>This is a helpful description</Description>
            </CheckboxField>
            <CheckboxField>
              <Checkbox disabled />
              <Label>Disabled checkbox</Label>
            </CheckboxField>
          </CheckboxGroup>
        </Panel>
      </section>

      {/* Radio Buttons */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Radio Buttons</h2>
        <Panel>
          <RadioGroup value={radioValue} onChange={setRadioValue}>
            <RadioField>
              <Radio value="option1" />
              <Label>Option 1</Label>
            </RadioField>
            <RadioField>
              <Radio value="option2" color="blue" />
              <Label>Option 2</Label>
              <Description>This option has a description</Description>
            </RadioField>
            <RadioField>
              <Radio value="option3" color="green" />
              <Label>Option 3</Label>
            </RadioField>
            <RadioField>
              <Radio value="option4" disabled />
              <Label>Disabled option</Label>
            </RadioField>
          </RadioGroup>
        </Panel>
      </section>

      {/* Dropdown */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Dropdown</h2>
        <Panel>
          <Dropdown>
            <DropdownButton>Options</DropdownButton>
            <DropdownMenu>
              <DropdownItem>
                <UserIcon data-slot="icon" />
                <DropdownLabel>Profile</DropdownLabel>
              </DropdownItem>
              <DropdownItem>
                <Cog6ToothIcon data-slot="icon" />
                <DropdownLabel>Settings</DropdownLabel>
                <DropdownDescription>
                  Manage your preferences
                </DropdownDescription>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem>
                <ArrowRightOnRectangleIcon data-slot="icon" />
                <DropdownLabel>Sign out</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Panel>
      </section>

      {/* Fieldset */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">
          Fieldset & Form Fields
        </h2>
        <Panel>
          <Fieldset>
            <Legend>Personal Information</Legend>
            <Field>
              <Label>Full name</Label>
              <Input placeholder="John Doe" />
            </Field>
            <Field>
              <Label>Email address</Label>
              <Input type="email" placeholder="john@example.com" />
              <Description>We'll never share your email.</Description>
            </Field>
            <Field>
              <Label>Password</Label>
              <Input type="password" />
              <ErrorMessage>
                Password must be at least 8 characters
              </ErrorMessage>
            </Field>
          </Fieldset>
        </Panel>
      </section>

      {/* Description List */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">
          Description List
        </h2>
        <Panel>
          <DescriptionList>
            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>John Doe</DescriptionDetails>

            <DescriptionTerm>Email</DescriptionTerm>
            <DescriptionDetails>john@example.com</DescriptionDetails>

            <DescriptionTerm>Role</DescriptionTerm>
            <DescriptionDetails>Administrator</DescriptionDetails>

            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>
              <Badge color="green">Active</Badge>
            </DescriptionDetails>
          </DescriptionList>
        </Panel>
      </section>

      {/* Dividers */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Dividers</h2>
        <Panel>
          <div className="space-y-4">
            <p>Content above</p>
            <Divider />
            <p>Content below (normal divider)</p>
            <Divider soft />
            <p>Content below (soft divider)</p>
          </div>
        </Panel>
      </section>

      {/* Navbar */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Navbar</h2>
        <Panel className="p-0">
          <Navbar>
            <NavbarSection>
              <NavbarItem href="/" current>
                <NavbarLabel>Home</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/about">
                <NavbarLabel>About</NavbarLabel>
              </NavbarItem>
              <NavbarItem href="/contact">
                <NavbarLabel>Contact</NavbarLabel>
              </NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarDivider />
              <NavbarItem href="/settings">
                <Cog6ToothIcon data-slot="icon" />
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        </Panel>
      </section>

      {/* Alert Dialog */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Alert Dialog</h2>
        <Panel>
          <Button onClick={() => setAlertOpen(true)}>Open Alert</Button>
          <Alert open={alertOpen} onClose={setAlertOpen}>
            <AlertTitle>Delete Account</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </AlertDescription>
            <AlertActions>
              <Button plain onClick={() => setAlertOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={() => setAlertOpen(false)}>
                Delete
              </Button>
            </AlertActions>
          </Alert>
        </Panel>
      </section>

      {/* Panels */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel variant="default">
            <Subheading>Default Panel</Subheading>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Standard panel with shadow
            </p>
          </Panel>
          <Panel variant="bordered">
            <Subheading>Bordered Panel</Subheading>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Panel with border
            </p>
          </Panel>
          <Panel variant="elevated">
            <Subheading>Elevated Panel</Subheading>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Panel with larger shadow
            </p>
          </Panel>
        </div>
      </section>

      {/* Color Combinations */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">
          Color Combinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <Heading className="!text-white mb-2">Blue Background</Heading>
            <Input placeholder="Input on blue..." className="mb-3" />
            <Button color="white">White Button</Button>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-lg">
            <Heading className="!text-white mb-2">Dark Background</Heading>
            <Input placeholder="Input on dark..." className="mb-3" />
            <Button color="sky">Sky Button</Button>
          </div>
        </div>
      </section>

      {/* Sidebar */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Sidebar</h2>
        <Panel className="p-0 overflow-hidden">
          <div className="h-96 flex">
            <Sidebar className="w-64 border-r border-border">
              <SidebarHeader>
                <SidebarHeading>Navigation</SidebarHeading>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current>
                    <UserIcon data-slot="icon" />
                    <SidebarLabel>Dashboard</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <Cog6ToothIcon data-slot="icon" />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter>
                <SidebarItem>
                  <ArrowRightOnRectangleIcon data-slot="icon" />
                  <SidebarLabel>Logout</SidebarLabel>
                </SidebarItem>
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 text-sm text-muted-foreground">
              Main content area
            </div>
          </div>
        </Panel>
      </section>

      {/* Switch */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Switch</h2>
        <Panel>
          <SwitchGroup>
            <SwitchField>
              <Label>Enable notifications</Label>
              <Switch />
            </SwitchField>
            <SwitchField>
              <Label>Blue switch</Label>
              <Switch color="blue" />
              <Description>Used for special states</Description>
            </SwitchField>
            <SwitchField>
              <Label>Disabled</Label>
              <Switch disabled />
            </SwitchField>
          </SwitchGroup>
        </Panel>
      </section>

      {/* Table */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Table</h2>
        <Panel className="p-0">
          <Table striped grid>
            <TableHead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              <TableRow href="#">
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>
                  <Badge color="green">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>
                  <Badge color="zinc">Inactive</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Panel>
      </section>

      {/* Text */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Text</h2>
        <Panel className="space-y-3">
          <Text>This is standard body text.</Text>
          <Text>
            You can use <TextLink href="#">inline links</TextLink> inside text.
          </Text>
          <Text>
            Use <Strong>Strong</Strong> for emphasis and <Code>Code</Code> for
            inline code.
          </Text>
        </Panel>
      </section>

      {/* Textarea */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Textarea</h2>
        <Panel className="space-y-4">
          <Textarea placeholder="Resizable textarea..." />
          <Textarea placeholder="Non-resizable textarea..." resizable={false} />
          <Textarea placeholder="Disabled textarea" disabled />
        </Panel>
      </section>

      {/* Layouts */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Layouts</h2>
        <Panel className="p-0 overflow-hidden">
          <div className="h-96 border border-border rounded-lg overflow-hidden">
            <StandardLayout
              navbar={
                <div className="text-white font-medium px-4">App Navbar</div>
              }
              sidebar={
                <Sidebar>
                  <SidebarBody>
                    <SidebarItem current>
                      <SidebarLabel>Home</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem>
                      <SidebarLabel>Settings</SidebarLabel>
                    </SidebarItem>
                  </SidebarBody>
                </Sidebar>
              }
            >
              <div className="text-sm text-muted-foreground">
                Layout content preview
              </div>
            </StandardLayout>
          </div>
        </Panel>
      </section>

      {/* Avatars */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Avatars</h2>
        <Panel>
          <div className="flex flex-wrap items-center gap-6">
            {/* Image avatar */}
            <Avatar
              src="https://i.pravatar.cc/100?img=12"
              alt="John Doe"
              className="size-12"
            />

            {/* Initials avatar */}
            <Avatar
              initials="JD"
              alt="Jane Doe"
              className="size-12 bg-muted text-foreground"
            />

            {/* Square avatar */}
            <Avatar
              src="https://i.pravatar.cc/100?img=32"
              square
              alt="Square avatar"
              className="size-12"
            />

            {/* Avatar button */}
            <AvatarButton
              initials="AB"
              alt="Avatar button"
              className="size-12 bg-primary text-primary-foreground"
              onClick={() => alert("Avatar button clicked")}
            />

            {/* Avatar link */}
            <AvatarButton
              href="/profile"
              src="https://i.pravatar.cc/100?img=56"
              alt="Avatar link"
              className="size-12"
            />
          </div>
        </Panel>
      </section>

      {/* Dialog */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Dialog</h2>
        <Panel>
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

          <Dialog open={dialogOpen} onClose={setDialogOpen} size="md">
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>
              Invite someone to collaborate on this project.
            </DialogDescription>

            <DialogBody className="space-y-4">
              <Field>
                <Label>Email address</Label>
                <Input type="email" placeholder="teammate@example.com" />
              </Field>

              <Field>
                <Label>Role</Label>
                <Select>
                  <option>Member</option>
                  <option>Admin</option>
                </Select>
              </Field>
            </DialogBody>

            <DialogActions>
              <Button plain onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Send Invite</Button>
            </DialogActions>
          </Dialog>
        </Panel>
      </section>

      {/* Icons */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Icons</h2>
        <Panel>
          <div className="flex gap-4">
            <EnvelopeIcon className="h-6 w-6" />
            <UserIcon className="h-6 w-6" />
            <Cog6ToothIcon className="h-6 w-6" />
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            <UserIcon className="h-8 w-8 text-green-600" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
