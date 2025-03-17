import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const searchFormSchema = z.object({
  search: z.string().min(1),
});

const SearchBar = () => {
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });
 
  const onSubmit = (data) => {
    if(data.search) {
      navigate(`/search/${data.search}`);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center w-full max-w-xl mx-auto"
      >
        <div className="relative flex items-center w-full shadow-sm">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Search..."
                    className="rounded-r-none border-2 focus:ring-2 focus:ring-primary focus:border-transparent h-12 text-base pl-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="submit"
            className="rounded-l-none h-12 px-6 hover:bg-primary/90 transition-colors"
            variant="default"
          >
            <FaSearch className="text-lg" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchBar;
