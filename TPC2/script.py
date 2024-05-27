import json
import os


class City:
    def __init__(self, city_id: str, name: str, population: str, description: str, district: str):
        self.city_id = city_id
        self.name = name
        self.population = population
        self.description = description
        self.district = district


class Connection:
    def __init__(self, from_id: str, to_id: str, distance: float):
        self.from_id = from_id
        self.to_id = to_id
        self.distance = distance


def parse_json(json_data) -> tuple[list[City], list[Connection]]:
    cities = []
    connections = []

    for city in json_data['cidades']:
        cities.append(City(city['id'], city['nome'], city['população'], city['descrição'], city['distrito']))

    for connection in json_data['ligacoes']:
        connections.append(Connection(connection['origem'], connection['destino'], float(connection['distância'])))

    return cities, connections


def get_city_by_id(cities: list[City], city_id: str) -> City | None:
    return next((city for city in cities if city.city_id == city_id), None)


def generate_index_city_item(city: City):
    return f"""
<div class="flex flex-col py-2">
    <a href="/{city.city_id}" class="text-lg font-semibold hover:underline">{city.name}</a>
</div>"""


def generate_index_html(cities: list[City]):
    with open('template/index.html', 'r', encoding="utf-8") as f:
        template = f.read()

    items = ""
    for city in cities:
        items += generate_index_city_item(city) + '\n'

    template = template.replace('<!-- CITY_ITEMS -->', items)

    with open('generated/index.html', 'w', encoding="utf-8") as f:
        f.write(template)


def generate_city_connection_item(connection: Connection, cities: list[City]):
    return f"""
<tr class="border-b text-lg">
    <th scope="row" class="px-6 py-4 font-medium text-gray-900 flex flex-row space-x-1">
        <a href="/{connection.from_id}" class="font-medium hover:underline">
            {get_city_by_id(cities, connection.from_id).name}
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
        </svg>
        <a href="/{connection.to_id}" class="font-medium hover:underline">
            {get_city_by_id(cities, connection.to_id).name}
        </a>
    </th>
    <td class="px-6 py-4">
        {connection.distance}km
    </td>
</tr>"""


def generate_city_html(city: City, cities: list[City], connections: list[Connection]):
    with open('template/cidade.html', 'r', encoding="utf-8") as f:
        template = f.read()

    template = template.replace('<!-- CITY_NAME -->', city.name)
    template = template.replace('<!-- CITY_DESCRIPTION -->', city.description)
    template = template.replace('<!-- CITY_POPULATION -->', city.population)
    template = template.replace('<!-- CITY_DISTRICT -->', city.district)

    items = ""

    for connection in connections:
        if connection.from_id == city.city_id:
            items += generate_city_connection_item(connection, cities) + '\n'

    template = template.replace('<!-- CITY_CONNECTION_ITEMS -->', items)

    with open(f'generated/{city.city_id}.html', 'w', encoding="utf-8") as f:
        f.write(template)


def main():
    with open('mapa-virtual.json', 'r', encoding="utf-8") as f:
        data = json.loads(f.read())

    cities, connections = parse_json(data)

    os.makedirs('generated', exist_ok=True)

    generate_index_html(cities)

    for city in cities:
        generate_city_html(city, cities, connections)


if __name__ == '__main__':
    main()