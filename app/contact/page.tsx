import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with all your spare parts needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field>
                <FieldLabel>Address</FieldLabel>
                <FieldDescription>
                  123 Auto Parts Street<br />
                  Industrial District<br />
                  City, State 12345
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Phone</FieldLabel>
                <FieldDescription>
                  +1 (555) 123-4567
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldDescription>
                  info@spareparts-webapp.com
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Business Hours</FieldLabel>
                <FieldDescription>
                  Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </FieldDescription>
              </Field>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" placeholder="Your full name" />
                  <FieldDescription>
                    Please enter your full name
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                  <FieldDescription>
                    We'll use this to get back to you
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="subject">Subject</FieldLabel>
                  <Input id="subject" placeholder="How can we help you?" />
                  <FieldDescription>
                    Briefly describe your inquiry
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                  />
                  <FieldDescription>
                    Provide as much detail as possible
                  </FieldDescription>
                </Field>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}