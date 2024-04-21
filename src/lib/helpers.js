
export function cart_body()
{
  return {
    items: []
  }
}

// 'cause they weren't pretty from the factory...
export function to_pretty(input)
{
  let out = input.split(" ");
  for (let i = 0; i < out.length; ++i)
    out[i] = out[i][0].toUpperCase() + out[i].substr(1);
  input = out.join(" ")
  return input;
}

export function unix_to_time(ts)
{
  let pretty_date = new Date(ts).toDateString();
  return pretty_date;
}

